const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com",
    )
    .render('tour', {
      title: `${tour.name} Tour`,
      tour,
    });
});

exports.getLoginForm = catchAsync(async (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.8/axios.min.js 'unsafe-inline' 'unsafe-eval';",
    )
    .render('login', {
      title: 'Log into your account',
    });
});

exports.getSignUpForm = (req, res) => {
  res.status(200).render('signup', {
    title: `Create New Account`,
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: `Your Account`,
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourIds = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.redirectIfNotLoggedIn = (req, res, next) => {
  if (!res.locals?.user) {
    return res.redirect('/login');
  }
  next();
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') {
    res.locals.alert =
      "Your booking was successful! Please check your email for confirmation. If your booking doesn't show up here immediately, please come back later.";
  }
  next();
};
