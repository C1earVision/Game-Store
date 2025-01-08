const CustomAPIError = require('../errors/custom-error')
const { StatusCodes } = require('http-status-codes')
const dbConnect = require('../db/dbconfig')
const sql = require('mssql');


const getAllGames = async (req, res) => {
  const query = req.query;
  let queryKeys = Object.keys(query).length > 0 ? Object.keys(query) : null;
  let queryValues = Object.values(query);

  try {
    const db = await dbConnect;

    if (queryKeys) {
      // Handle filtering by CategoryId
      if (queryKeys.includes('CategoryId')) {
        const index = queryKeys.indexOf('CategoryId');
        let categoryId = await db.request()
          .input('Category', queryValues[index])
          .query(`SELECT CategoryId FROM Category WHERE Name = @Category`);
        categoryId = categoryId.recordset[0]?.CategoryId;
        if (categoryId !== undefined) {
          queryKeys[index] = 'p.CategoryId';
          queryValues[index] = categoryId;
        }
      }

      // Handle filtering by Name
      if (queryKeys.includes('Name')) {
        const nameIndex = queryKeys.indexOf('Name');
        const result = await db.request()
          .input('Name', sql.VarChar, `%${queryValues[nameIndex]}%`)
          .query(`        
            SELECT p.ProductId, p.Name, p.Brand, p.Price, 
                   c.Name AS CategoryName, p.Platform,
                   STRING_AGG(CONVERT(VARCHAR(MAX), i.Img, 1), ',') AS Images
            FROM Product p
            LEFT JOIN Product_IMG i ON p.ProductId = i.ProductId
            LEFT JOIN Category c ON p.CategoryId = c.CategoryId
            WHERE p.Name LIKE @Name
            GROUP BY p.ProductId, p.Name, p.Brand, p.Price, 
                  p.Platform, c.Name
          `);

          const processedGames = result.recordset.map(game => {
            const images = game.Images
              ? game.Images.split(',').map((image) =>{
                  const cleanImage = image.startsWith('0x') ? image.slice(2) : image;
                  return `data:image/png;base64,${Buffer.from(cleanImage, 'hex').toString('base64')}`
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

      const request = db.request();
      const result = await request
        .input('QueryValue', queryValues[0])
        .input('QueryValue2', queryValues[1])
        .input('QueryValue3', queryValues[2])
        .query(`
          SELECT p.ProductId, p.Name, p.Brand, p.Description, p.Rating, p.Price, p.StockQuantity, 
                c.Name AS CategoryName, p.Platform, p.ReleaseDate,
                STRING_AGG(CONVERT(VARCHAR(MAX), i.Img, 1), ',') AS Images
          FROM Product p
          LEFT JOIN Product_IMG i ON p.ProductId = i.ProductId
          LEFT JOIN Category c ON p.CategoryId = c.CategoryId
          ${queryKeys[0] !== 'ORDER BY' ? `WHERE ${queryKeys[0]} = @QueryValue` : ''}  
          ${queryKeys[1] && queryKeys[1] !== 'ORDER BY' ? `AND ${queryKeys[1]} = @QueryValue2` : ''} 
          ${queryKeys[2] && queryKeys[2] !== 'ORDER BY' ? `AND ${queryKeys[2]} = @QueryValue3` : ''} 
          GROUP BY p.ProductId, p.Name, p.Brand, p.Description, p.Rating, p.Price, p.StockQuantity, 
                  p.CategoryId, p.Platform, p.ReleaseDate, c.Name
          ${queryKeys.includes('ORDER BY') ? `ORDER BY ${queryValues[queryKeys.indexOf('ORDER BY')]}` : ''} 
        `);

      // Process and convert hex images to base64
      const processedGames = result.recordset.map(game => {
        const images = game.Images
          ? game.Images.split(',').map((image) =>{
              const cleanImage = image.startsWith('0x') ? image.slice(2) : image;
              return `data:image/png;base64,${Buffer.from(cleanImage, 'hex').toString('base64')}`
      })
          : [];
        return { ...game, Images: images };
      });

      res.status(StatusCodes.OK).json({ games: processedGames });
    } else {
      const request = db.request();
      const result = await request.query(`
        SELECT p.ProductId, p.Name, p.Brand, p.Description, p.Rating, p.Price, p.StockQuantity, 
               c.Name AS CategoryName, p.Platform, p.ReleaseDate,
               STRING_AGG(CONVERT(VARCHAR(MAX), i.Img, 1), ',') AS Images
        FROM Product p
        LEFT JOIN Product_IMG i ON p.ProductId = i.ProductId
        LEFT JOIN Category c ON p.CategoryId = c.CategoryId
        GROUP BY p.ProductId, p.Name, p.Brand, p.Description, p.Rating, p.Price, p.StockQuantity, 
                 p.CategoryId, p.Platform, p.ReleaseDate, c.Name
      `);

      const processedGames = result.recordset.map(game => {
        const images = game.Images
          ? game.Images.split(',').map((image) =>{
              const cleanImage = image.startsWith('0x') ? image.slice(2) : image;
              return `data:image/png;base64,${Buffer.from(cleanImage, 'hex').toString('base64')}`
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
    const db = await dbConnect;

    // Query the database to get the game details and associated images
    const result = await db.request().query(`
      SELECT p.ProductId, p.Name, p.Brand, p.Description, p.Rating, p.Price, p.StockQuantity, 
             c.Name AS CategoryName, p.Platform, p.ReleaseDate,
             STRING_AGG(CONVERT(VARCHAR(MAX), i.Img, 1), ',') AS Images
      FROM Product p
      LEFT JOIN Product_IMG i ON p.ProductId = i.ProductId
      LEFT JOIN Category c ON p.CategoryId = c.CategoryId
      WHERE p.ProductId = ${id}
      GROUP BY p.ProductId, p.Name, p.Brand, p.Description, p.Rating, p.Price, p.StockQuantity, 
               p.CategoryId, p.Platform, p.ReleaseDate, c.Name
    `);

    // Check if a game was found
    if (result.recordset.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Game not found" });
    }

    // Convert hex images to base64 strings
    const game = result.recordset[0];
    const imagesArray = game.Images
      ? game.Images.split(',').map(image => {
          const cleanImage = image.startsWith('0x') ? image.slice(2) : image;
          const base64Image = Buffer.from(cleanImage, 'hex').toString('base64');
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