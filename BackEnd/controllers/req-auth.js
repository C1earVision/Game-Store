const CustomAPIError = require('../errors/custom-error')
const { StatusCodes } = require('http-status-codes')
const pool = require('../db/dbconfig')



const addGame = async (req, res) => {
  const { admin } = req.user;
  const { name, brand, desc, rating, price, sq, categoryId, platform, releaseDate } = req.body;
  const imgs = req.files ? req.files.imgs : [];

  if (!admin) {
    throw new CustomAPIError('This user has no access to this route', StatusCodes.UNAUTHORIZED);
  }

  if (!imgs || imgs.length === 0) {
    throw new CustomAPIError('At least one image is required', StatusCodes.BAD_REQUEST);
  }

  try {
    const categoryQuery = await pool.query(
      `SELECT "CategoryId" FROM "Category" WHERE "Name" = $1`,
      [categoryId]
    );

    if (categoryQuery.rows.length === 0) {
      throw new CustomAPIError('Category not found', StatusCodes.BAD_REQUEST);
    }

    const categoryIdFromDb = categoryQuery.rows[0].CategoryId;

    // Insert the game into the Product table
    const productResult = await pool.query(
      `INSERT INTO "Product" ("Name", "Brand", "Description", "Rating", "Price", "StockQuantity", "CategoryId", "Platform", "ReleaseDate") 
       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING "ProductId"`,
      [name, brand, desc, rating, price, sq, categoryIdFromDb, platform, releaseDate]
    );

    const newProductId = productResult.rows[0].ProductId;

    // Save images to the database
    for (let img of imgs) {
      const imgBuffer = img.buffer;  // Get the buffer from the uploaded image
      await pool.query(
        `INSERT INTO "Product_IMG" ("ProductId", "Img") VALUES($1, $2)`,
        [newProductId, imgBuffer]
      );
    }

    res.status(StatusCodes.OK).send('Game added successfully');
  } catch (err) {
    console.error("Error adding game: ", err);
    throw new CustomAPIError('Error adding the game to the database', StatusCodes.INTERNAL_SERVER_ERROR);
  }
};



const addCategory = async (req, res) => {
  const { admin } = req.user
  const { name, desc } = req.body
  if (!admin) {
    throw new CustomAPIError('this user has no access to this route', StatusCodes.UNAUTHORIZED)
  }
  await pool.query(
    `INSERT INTO "Category" ("Name", "Description") VALUES($1, $2)`,
    [name, desc]
  );
  res.status(StatusCodes.CREATED).send('Category Added Successfully')
}



const modifyGame = async (req, res) => {
  const { params: { id }, user: { admin } } = req;
  const update = req.body; 
  const files = req.files;
  if (!admin) {
    throw new CustomAPIError('this user has no access to this route', StatusCodes.UNAUTHORIZED);
  }

  // Handle non-file field updates (e.g., CategoryId)
  if (Object.keys(update)[0] == 'CategoryId') {
    const CategoryId = await pool.query(
      `SELECT "CategoryId" FROM "Category" WHERE "Name" = $1`,
      [update[Object.keys(update)[0]]]
    );
    
    await pool.query(
      `UPDATE "Product" SET "CategoryId" = $1 WHERE "ProductId" = $2`,
      [CategoryId.rows[0].CategoryId, id]
    );

    res.status(StatusCodes.OK).send('Game Modified');
  
  } else if (files && files.image0) {  
    const image = files.image0[0];  
    const imageBuffer = image.buffer;  
    if (!imageBuffer) {
      return res.status(StatusCodes.BAD_REQUEST).send('No image data provided');
    }

    try {
      await pool.query(
        `UPDATE "Product_IMG" SET "Img" = $1 WHERE "ProductId" = $2`,
        [imageBuffer, id]
      );

      res.status(StatusCodes.OK).send('Game Modified');

    } catch (error) {
      console.error('Error updating image:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Failed to update image');
    }

  } else {
    const fieldName = Object.keys(update)[0];
    await pool.query(
      `UPDATE "Product" SET "${fieldName}" = $1 WHERE "ProductId" = $2`,
      [update[fieldName], id]
    );

    res.status(StatusCodes.OK).send('Game Modified');
  }
};




const modifyAdminAccess = async (req, res) => {
  const { params: { id }, user: { admin } } = req
  if (!admin) {
    throw new CustomAPIError('this user has no access to this route', StatusCodes.UNAUTHORIZED)
  }
  const user = await pool.query(
    `SELECT "CustomerId", "AdminState" FROM "Customer" WHERE "CustomerId" = $1`,
    [id]
  );
  const adminState = user.rows[0].AdminState == 0 ? 1 : 0
  await pool.query(
    `UPDATE "Customer" SET "AdminState" = $1 WHERE "CustomerId" = $2`,
    [adminState, user.rows[0].CustomerId]
  );
  res.status(StatusCodes.OK).send('Admin State Changed Successfully')
}

const deleteGame = async (req, res) => {
  const { params: { id }, user: { admin } } = req
  if (!admin) {
    throw new CustomAPIError('this user has no access to this route', StatusCodes.UNAUTHORIZED)
  }
  await pool.query(
    `DELETE FROM "Product" WHERE "ProductId" = $1`,
    [id]
  );
  res.status(StatusCodes.OK).send('book deleted succesfully')
}

const addGameToCart = async (req, res) => {
  const { user: { customerId }, params: { id: productId }, body: { quantity } } = req
  const cartId = await pool.query(
    `SELECT "CartId" FROM "Cart" WHERE "CustomerId" = $1`,
    [customerId]
  );
  await pool.query(
    `INSERT INTO "CartItem" ("Quantity", "CartId", "ProductId") VALUES ($1, $2, $3)`,
    [quantity, cartId.rows[0].CartId, productId]
  );
  res.status(StatusCodes.OK).send('Game Added to Cart')
}

const getCartItems = async (req, res) => {
  const { customerId } = req.user;

  const cartIdResult = await pool.query(
    `SELECT "CartId" FROM "Cart" WHERE "CustomerId" = $1`,
    [customerId]
  );

  const cartId = cartIdResult.rows[0].CartId;

  const games = await pool.query(
    `SELECT 
      p."ProductId",
      p."Name", 
      p."Price",
      p."Brand",
      p."Platform",
      ci."Quantity"
    FROM "CartItem" ci
    INNER JOIN "Product" p ON ci."ProductId" = p."ProductId"
    WHERE ci."CartId" = $1`,
    [cartId]
  );

  res.status(StatusCodes.OK).json({ games: games.rows });

}

const deleteCartItem = async (req, res) => {
  const { params: { id: productId }, user: { customerId } } = req
  const cartId = await pool.query(
    `SELECT "CartId" FROM "Cart" WHERE "CustomerId" = $1`,
    [customerId]
  );

  await pool.query(
    `DELETE FROM "CartItem" WHERE "CartId" = $1 AND "ProductId" = $2`,
    [cartId.rows[0].CartId, productId]
  );

  res.status(StatusCodes.OK).send('Game Deleted Successfully')
}

const placeOrder = async (req, res) => {
  const { user: { customerId }, body: {cartItems, total} } = req

  let orderResult = await pool.query(
    `INSERT INTO "TheOrder" ("CustomerId", "TotalAmount", "AmountPaid")
     VALUES ($1, $2, $3)
     RETURNING "OrderId"`,
    [customerId, total, total]
  );

  const orderId = orderResult.rows[0].OrderId;

  let orderItemResult = await pool.query(
    `INSERT INTO "OrderItem" ("Price", "OrderId")
     VALUES ($1, $2)
     RETURNING "OrderItemId"`,
    [total, orderId]
  );
  const orderItemId = orderItemResult.rows[0].OrderItemId;


  for (const item of cartItems) {
    await pool.query(
      `INSERT INTO "OrderItemProducts" ("OrderItemId", "ProductId", "Quantity")
       VALUES ($1, $2, $3)`,
      [orderItemId, item.ProductId, item.Quantity]
    );
  }

  
  res.status(StatusCodes.CREATED).send('Order Placed Successfully')
}


const getOrders = async (req, res) => {
  const { user: { customerId, admin } } = req
  
  let queryText = `
    SELECT
      p."Name" AS "ProductName",
      p."Price" AS "ProductPrice",
      oi."Price" AS "TotalOrderPrice",
      oip."Quantity",
      o."CustomerId",
      o."OrderId",
      o."OrderDate",
      o."Status"
    FROM "TheOrder" o
    INNER JOIN "OrderItem" oi ON o."OrderId" = oi."OrderId"
    INNER JOIN "OrderItemProducts" oip ON oi."OrderItemId" = oip."OrderItemId"
    INNER JOIN "Product" p ON oip."ProductId" = p."ProductId"`;

  let params = [];
  if (admin !== 1) {
    queryText += ` WHERE o."CustomerId" = $1`;
    params = [customerId];
  }

  const orders = await pool.query(queryText, params);
  
  const groupedOrders = orders.rows.reduce((acc, order) => {
    const { OrderId, ProductName, CustomerId, ProductPrice, TotalOrderPrice, OrderDate, Quantity, Status } = order;
  
    const existingOrder = acc.find((group) => group.OrderId === OrderId);
  
    if (existingOrder) {
      existingOrder.Products.push({
        ProductName,
        ProductPrice,
        Quantity
      });
    } else {
      acc.push({
        OrderId,
        CustomerId,
        TotalOrderPrice,
        OrderDate,
        Status,
        Products: [
          {
            ProductName,
            ProductPrice,
            Quantity
          }
        ]
      });
    }
  
    return acc;
  }, []);  
  if (admin) {
    const addresses = [];
    
    await Promise.all(groupedOrders.map(async (order) => {
      const address = await pool.query(
        `SELECT "Country", "City", "State", "Street" FROM "Customer" WHERE "CustomerId" = $1`,
        [order.CustomerId]
      );
        
      addresses.push(address.rows[0]);
    }));
  
    console.log(addresses);
    res.status(StatusCodes.OK).send({ groupedOrders, addresses });
    return;
  }
  
  res.status(StatusCodes.OK).send(groupedOrders);
  
}

const updateOrderStatus = async (req, res)=>{
  const { status, orderId } = req.body
  await pool.query(
    `UPDATE "TheOrder" SET "Status" = 'DELIVERED' WHERE "OrderId" = $1`,
    [orderId]
  );
  res.status(StatusCodes.OK).send('Status Has Been Updated Successfully')
}


const addReview = async (req, res) => {
  const {id:productId} = req.params
  const {rating, comment} = req.body

  await pool.query(
    `INSERT INTO "Review" ("ProductId", "Rating", "Comment") VALUES ($1, $2, $3)`,
    [productId, rating, comment]
  );
  res.status(StatusCodes.OK).send('Review Added Successfully')
}

module.exports = {
  addGame,
  addCategory,
  deleteGame,
  modifyGame,
  modifyAdminAccess,
  addGameToCart,
  getCartItems,
  deleteCartItem,
  addReview,
  placeOrder,
  getOrders,
  updateOrderStatus
}