import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  //   console.log(req.headers.cookie);
  if (!req.headers.cookie) {
    next(new Error('Unauthorized, please sign in', { cause: 401 }));
    // in express 5 is same as openly throwing error
    // throw Error('Unauthorized, please sign in', { cause: 401 });
  }

  const cookies = req.headers.cookie.split('; ');
  //   console.log(cookies);

  const cookieArrays = cookies.map(cookie => cookie.split('='));
  //   console.log(cookieArrays);

  const cookiesObj = Object.fromEntries(cookieArrays);
  //   console.log(cookiesObj);

  const { token } = cookiesObj;
  //   console.log(token);

  if (!token) {
    next(new Error('Unauthorized, please sign in', { cause: 401 }));
  }

  //verify the token
  const { userId } = jwt.verify(token, process.env.JWT_SECRET);
  //   console.log(userId);

  // add userId property to the request object
  req.userId = userId;

  next();
};

export default verifyToken;
