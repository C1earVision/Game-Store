const CustomAPIError = require('../errors/custom-error')
const { StatusCodes } = require('http-status-codes')
const pool = require('../db/dbconfig')


const getAllGames = async (req, res) => {
  const query = req.query;
  let queryKeys = Object.keys(query).length > 0 ? Object.keys(query) : null;
  let queryValues = Object.values(query);

  try {
    if (queryKeys) {
      // Handle filtering by CategoryId
      if (queryKeys.includes('CategoryId')) {
        const index = queryKeys.indexOf('CategoryId');
        let categoryResult = await pool.query(
          `SELECT "CategoryId" FROM "Category" WHERE "Name" = $1`,
          [queryValues[index]]
        );
        if (categoryResult.rows.length === 0) {
          // Category not found — return empty
          return res.status(StatusCodes.OK).json({ games: [] });
        }
        queryKeys[index] = 'p."CategoryId"';
        queryValues[index] = categoryResult.rows[0].CategoryId;
      }

      // Handle filtering by Name
      if (queryKeys.includes('Name')) {
        const nameIndex = queryKeys.indexOf('Name');
        const result = await pool.query(
          `SELECT p."ProductId", p."Name", p."Brand", p."Price", 
                  c."Name" AS "CategoryName", p."Platform",
                  STRING_AGG(encode(i."Img", 'hex'), ',') AS "Images"
           FROM "Product" p
           LEFT JOIN "Product_IMG" i ON p."ProductId" = i."ProductId"
           LEFT JOIN "Category" c ON p."CategoryId" = c."CategoryId"
           WHERE p."Name" ILIKE $1
           GROUP BY p."ProductId", p."Name", p."Brand", p."Price", 
                 p."Platform", c."Name"`,
          [`%${queryValues[nameIndex]}%`]
        );

        const processedGames = result.rows.map(game => {
          const images = game.Images
            ? game.Images.split(',').map((image) => {
                return `data:image/png;base64,${Buffer.from(image, 'hex').toString('base64')}`
            })
            : [];
          return { ...game, Images: images };
        });
    
        res.status(StatusCodes.OK).json({ games: processedGames });
        return;
      }

      // Handle ORDER_BY query
      if (queryKeys.includes('ORDER_BY')) {
        const orderByIndex = queryKeys.indexOf('ORDER_BY');
        const key = queryKeys[orderByIndex].split('_').join(' ');
        const value = queryValues[orderByIndex].split('_').join(' ');
        queryKeys[orderByIndex] = key;
        queryValues[orderByIndex] = value;
      }

      // Build parameterized WHERE clauses
      const whereClauses = [];
      const params = [];
      let paramIndex = 1;

      for (let i = 0; i < queryKeys.length; i++) {
        if (queryKeys[i] !== 'ORDER BY') {
          whereClauses.push(`${queryKeys[i]} = $${paramIndex}`);
          params.push(queryValues[i]);
          paramIndex++;
        }
      }

      const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
      const orderBySQL = queryKeys.includes('ORDER BY') ? `ORDER BY ${queryValues[queryKeys.indexOf('ORDER BY')]}` : '';

      const result = await pool.query(
        `SELECT p."ProductId", p."Name", p."Brand", p."Description", p."Rating", p."Price", p."StockQuantity", 
               c."Name" AS "CategoryName", p."Platform", p."ReleaseDate",
               STRING_AGG(encode(i."Img", 'hex'), ',') AS "Images"
         FROM "Product" p
         LEFT JOIN "Product_IMG" i ON p."ProductId" = i."ProductId"
         LEFT JOIN "Category" c ON p."CategoryId" = c."CategoryId"
         ${whereSQL}
         GROUP BY p."ProductId", p."Name", p."Brand", p."Description", p."Rating", p."Price", p."StockQuantity", 
                 p."CategoryId", p."Platform", p."ReleaseDate", c."Name"
         ${orderBySQL}`,
        params
      );

      // Process and convert hex images to base64
      const processedGames = result.rows.map(game => {
        const images = game.Images
          ? game.Images.split(',').map((image) => {
              return `data:image/png;base64,${Buffer.from(image, 'hex').toString('base64')}`
          })
          : [];
        return { ...game, Images: images };
      });

      res.status(StatusCodes.OK).json({ games: processedGames });
    } else {
      const result = await pool.query(`
        SELECT p."ProductId", p."Name", p."Brand", p."Description", p."Rating", p."Price", p."StockQuantity", 
               c."Name" AS "CategoryName", p."Platform", p."ReleaseDate",
               STRING_AGG(encode(i."Img", 'hex'), ',') AS "Images"
        FROM "Product" p
        LEFT JOIN "Product_IMG" i ON p."ProductId" = i."ProductId"
        LEFT JOIN "Category" c ON p."CategoryId" = c."CategoryId"
        GROUP BY p."ProductId", p."Name", p."Brand", p."Description", p."Rating", p."Price", p."StockQuantity", 
                 p."CategoryId", p."Platform", p."ReleaseDate", c."Name"
      `);

      const processedGames = result.rows.map(game => {
        const images = game.Images
          ? game.Images.split(',').map((image) => {
              return `data:image/png;base64,${Buffer.from(image, 'hex').toString('base64')}`
          })
          : [];
        return { ...game, Images: images };
      });

      res.status(StatusCodes.OK).json({ games: processedGames });
    }
  } catch (err) {
    console.error("Error querying the database: ", err);
    throw new CustomAPIError('Error querying the database', StatusCodes.BAD_REQUEST);
  }
};


const getGame = async (req, res) => {
  const { id } = req.params;

  try {
    // Query the database to get the game details and associated images
    const result = await pool.query(
      `SELECT p."ProductId", p."Name", p."Brand", p."Description", p."Rating", p."Price", p."StockQuantity", 
             c."Name" AS "CategoryName", p."Platform", p."ReleaseDate",
             STRING_AGG(encode(i."Img", 'hex'), ',') AS "Images"
       FROM "Product" p
       LEFT JOIN "Product_IMG" i ON p."ProductId" = i."ProductId"
       LEFT JOIN "Category" c ON p."CategoryId" = c."CategoryId"
       WHERE p."ProductId" = $1
       GROUP BY p."ProductId", p."Name", p."Brand", p."Description", p."Rating", p."Price", p."StockQuantity", 
                p."CategoryId", p."Platform", p."ReleaseDate", c."Name"`,
      [id]
    );

    // Check if a game was found
    if (result.rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Game not found" });
    }

    // Convert hex images to base64 strings
    const game = result.rows[0];
    const imagesArray = game.Images
      ? game.Images.split(',').map(image => {
          const base64Image = Buffer.from(image, 'hex').toString('base64');
          return `data:image/png;base64,${base64Image}`;
        })
      : [];
      
    
    // Construct the response
    res.status(StatusCodes.OK).json({
      game: [
        {
          ...game,
          Images: imagesArray,
        },
      ],
    });
  } catch (err) {
    console.error("Error querying the database: ", err);
    throw new CustomAPIError('Error querying the database', StatusCodes.BAD_REQUEST);
  }
};



module.exports = {
  getAllGames,
  getGame
}