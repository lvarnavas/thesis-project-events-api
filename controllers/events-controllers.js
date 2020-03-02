const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");

const Events = require("../models/events");
const Users = require("../models/users");
const Cities = require("../models/cities");
const Prefectures = require("../models/prefectures");
const Categories = require("../models/categories");
const Reports = require("../models/reports");
const Comments = require("../models/comments");
const Images = require("../models/images");

const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_KEY
    }
  })
);

const getEvents = async (req, res, next) => {
  let events;

  try {
    events = await Events.findAll({ raw: true });
  } catch (err) {
    const error = new HttpError(
      "Fetching events failed, please try again.",
      500
    );
    return next(error);
  }

  res.json({ events });
};

const getEventById = async (req, res, next) => {
  const eventId = req.params.eid;

  let event;

  try {
    event = await Events.findByPk(eventId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find an event",
      500
    );
    return next(error);
  }

  if (!event) {
    const error = new HttpError(
      "Could not find an event for the provided id.",
      404
    );
    return next(error);
  }
  // OBJECT
  res.json({ event });
};

const getEventsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let events;
  try {
    events = await Events.findAll({
      where: { userId: userId },
      include: [
        {
          model: Categories,
          raw: true
        },
        { model: Cities, raw: true },
        {
          model: Prefectures,
          raw: true
        }
      ],
      nest: true,
      raw: true
    });
  } catch (err) {
    const error = new HttpError("Could not fetch categories", 500);
    console.log(err);
    return next(error);
  }
  // ARRAY
  res.json({ events });
  console.log(events);
};

const getSpecificEvent = async (req, res, next) => {
  const eventId = req.params.eid;

  let specEvent;
  try {
    specEvent = await Events.findAll({
      where: { id: eventId },
      include: 
      [
        {
          model: Categories,
        },
        { 
          model: Cities
        },
        {
          model: Prefectures,
        },
        {
          model: Users,
        }
      ],
      nest: true,
      raw: true
    });
  } catch (err) {
    const error = new HttpError("Could not fetch specific event", 500);
    return next(error);
  }

  res.json({ specEvent });
};

const getEventsByCategoryId = async (req, res, next) => {
  const categoryId = req.params.catid;

  let events;
  try {
    events = await Events.findAll({
      include: {
        model: Categories,
        where: { id: categoryId }
      },
      raw: true,
      nest: true
    });
  } catch (err) {
    const error = new HttpError(
      "Fetching events for this category failed, please try again",
      500
    );
    return next(error);
  }

  if (!events || events.length === 0) {
    return next(
      new HttpError(
        "No Events found for this category.",
        404
      )
    );
  }
  console.log(events);
  res.json({ events });
};

const getEventsByCategory = async (req, res, next) => {
  const { category } = req.body;

  let events;
  try {
    events = await Events.findAll({
      include: {
        model: Categories,
        where: { category: category }
      },
      raw: true,
      nest: true
    });
  } catch (err) {
    const error = new HttpError(
      "Fetching events for this category failed, please try again",
      500
    );
    return next(error);
  }

  if (!events || events.length === 0) {
    return next(
      new HttpError("No Events found for this category.", 404)
    );
  }

  res.json({ events });
};

const getEventsByCity = async (req, res, next) => {
  const { city } = req.body;

  let events;
  try {
    events = await Events.findAll({
      include: {
        model: Cities,
        where: { city: city }
      },
      raw: true,
      nest: true
    });
  } catch (err) {
    const error = new HttpError(
      "Fetching events for this city failed, please try again",
      500
    );
    return next(error);
  }

  if (!events || events.length === 0) {
    return next(
      new HttpError("No Events found for this city.", 404)
    );
  }

  res.json({ events });
};

const getEventsByCityId = async (req, res, next) => {
  const cityId = req.params.ctid;

  let events;
  try {
    events = await Events.findAll({
      include: {
        model: Cities,
        where: { id: cityId }
      },
      raw: true,
      nest: true
    });
  } catch (err) {
    const error = new HttpError(
      "Fetching events for this city failed, please try again",
      500
    );
    return next(error);
  }

  if (!events || events.length === 0) {
    return next(
      new HttpError("Could not find an event for the provided city id.", 404)
    );
  }

  res.json({ events });
};

const getEventsByPrefecture = async (req, res, next) => {
  const { prefecture } = req.body;

  let events;
  try {
    events = await Events.findAll({
      include: {
        model: Prefectures,
        where: { prefecture: prefecture }
      },
      raw: true,
      nest: true
    });
  } catch (err) {
    const error = new HttpError(
      "Fetching events for this prefecture failed, please try again",
      500
    );
    return next(error);
  }

  if (!events || events.length === 0) {
    return next(
      new HttpError("No Events found for this prefecture.", 404)
    );
  }

  res.json({ events });
};

const getEventsByPrefectureId = async (req, res, next) => {
  const prefectureId = req.params.prefid;

  let events;
  try {
    events = await Events.findAll({
      include: {
        model: Prefectures,
        where: { id: prefectureId }
      },
      raw: true,
      nest: true
    });
  } catch (err) {
    const error = new HttpError(
      "Fetching events for this prefecture failed, please try again",
      500
    );
    return next(error);
  }

  if (!events || events.length === 0) {
    return next(
      new HttpError(
        "Could not find an event for the provided prefecture id.",
        404
      )
    );
  }

  res.json({ events });
};

const getEventsByStartDate = async (req, res, next) => {
  const { startDate } = req.body;

  let events;
  try {
    events = await Events.findAll({
      where: { startDate: startDate }
    });
  } catch (err) {
    const error = new HttpError(
      "Fetching events for this starting date failed, please try again",
      500
    );
    return next(error);
  }

  if (!events || events.length === 0) {
    return next(
      new HttpError("No Events found for this date.", 404)
    );
  }

  res.json({ events });
};

const EventsByStartDate = async (req, res, next) => {
  const startDate = req.params.date;

  let events;
  try {
    events = await Events.findAll({
      where: { startDate: startDate }
    });
  } catch (err) {

    const error = new HttpError(
      "Fetching events for this starting date failed, please try again",
      500
    );
    return next(error);
  }

  if (!events || events.length === 0) {
    return next(
      new HttpError("Could not find an event for the provided start date.", 404)
    );
  }

  res.json({ events });
};

const createEvent = async (req, res, next) => {
  // ΘΑ ΕΛΕΓΞΕΙ ΤΟ REQUEST OBJECT ΓΙΑ ΝΑ ΔΕΙ ΑΝ ΥΠΑΡΧΟΥΝ VALIDATION ERRORS
  // ΚΑΙ ΘΑ ΑΠΟΘΗΚΕΥΣΕΙ ΑΥΤΟ ΤΟ OBJECT ΣΤΟ errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    title,
    description,
    address,
    city,
    prefecture,
    category,
    startDate,
    endDate,
    startTime,
    userId,
    images,
  } = req.body;

  // ΚΑΝΕΙ CONVERT ΤΗ ΔΙΕΥΘΥΝΣΗ ΣΕ COORDINATES ΚΑΙ ΕΠΙΣΤΡΕΦΕΙ PROMISE
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  let existingCity;
  try {
    existingCity = await Cities.findOne({ where: { city: city } });
  } catch (err) {
    const error = new HttpError("could not find existing city", 404);
    return next(error);
  }

  let c;
  if (!existingCity) {
    try {
      c = await Cities.create({ city: city });
    } catch (err) {
      const error = new HttpError("could not create cities", 500);
      return next(error);
    }
  } else {
    c = existingCity;
  }

  let existingPrefecture;
  try {
    existingPrefecture = await Prefectures.findOne({
      where: { prefecture: prefecture }
    });
  } catch (err) {
    const error = new HttpError("could not find existing prefecture", 404);
    return next(error);
  }

  let p;
  if (!existingPrefecture) {
    try {
      p = await Prefectures.create({ prefecture: prefecture });
    } catch (err) {
      const error = new HttpError("could not create prefecture", 500);
      return next(error);
    }
  } else {
    p = existingPrefecture;
  }

  let existingCategory;
  try {
    existingCategory = await Categories.findOne({
      where: { category: category }
    });
  } catch (err) {
    const error = new HttpError("could not find existing category", 404);
    return next(error);
  }

  let cat;
  if (!existingCategory) {
    try {
      cat = await Categories.create({ category: category });
    } catch (err) {
      const error = new HttpError("could not create category", 500);
      return next(error);
    }
  } else {
    cat = existingCategory;
  }

  const lat = coordinates.lat;
  const lng = coordinates.lng;

  let createdEvent;
  try {
    createdEvent = await Events.build({
      title,
      description,
      address,
      lat: lat,
      lng: lng,
      startDate,
      endDate,
      startTime,
      images,
      cityId: c.id,
      prefectureId: p.id,
      categoryId: cat.id,
      userId
    });
  } catch (err) {
    const error = new HttpError("Could not build event", 500);
    return next(error);
  }

  let existingUser;
  try {
    existingUser = await Users.findByPk(userId);
  } catch (err) {
    const error = new HttpError("No such user.", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Could not find user for the provided id.",
      404
    );
    return next(error);
  }

  try {
    await createdEvent.save();
  } catch (err) {
    const error = new HttpError(
      "Creating Event failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ event: createdEvent });
};

const uploadImage = async (req, res, next) => {
  const { eventId } = req.body;

  try {
    if (req.files) {
      const images = [];
      let img;

      for (image of req.files) {
        img = await Images.create({
          image: image.path,
          eventId: eventId
        });
        images.push(img);
      }
      console.log({ images });
      return res.json({ images });
    }
  } catch (err) {
    const error = new HttpError("could not build images.", 500);
    console.log(err);
    return next(error);
  }
};

const updateEvent = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    title,
    address,
    startDate,
    endDate,
    startTime,
    description
  } = req.body;

  const eventId = req.params.eid;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const lat = coordinates.lat;
  const lng = coordinates.lng;

  let event;
  try {
    event = await Events.findByPk(eventId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update event",
      500
    );
    console.log(err);
    return next(error);
  }

  if (event.userId !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to edit this Event.', 401
    );
    return next(error);
  }

  event.title = title;
  event.address = address;
  (event.lat = lat), (event.lng = lng), (event.startDate = startDate);
  event.endDate = endDate;
  event.startTime = startTime;
  event.description = description;

  try {
    await event.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update event",
      500
    );
    return next(error);
  }

  res.status(200).json({ event: event });
};

const deleteEvent = async (req, res, next) => {
  const eventId = req.params.eid;

  let event;
  try {
    event = await Events.findByPk(eventId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete event.",
      500
    );
    return next(error);
  }

  if (event.userId !== req.userData.userId) {
    const error = new HttpError('You are not allowed to delete this Event.', 401);
    return next(error);
  }

  try {
    await event.destroy();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete event.", 500);
    return next(error);
  }

  res.status(200).json({ message: "Event deleted." });
};

const addReport = async (req, res, next) => {
  const eventId = req.params.eid;
  const { userId, creatorId } = req.body;

  let addedReport;
  try {
    addedReport = await Reports.build({
      userId,
      eventId
    });
  } catch (err) {
    const error = new HttpError("Could not add report", 500);
    return next(error);
  }

  try {
    await addedReport.save();
  } catch (err) {
    const error = new HttpError("You have already reported this event.", 500);
    return next(error);
  }

  let event;
  try {
    event = await Reports.findAll({
      where: { eventId: eventId },
      raw: true
    });
  } catch (err) {
    const error = new HttpError("could not find that event.", 401);
    return next(error);
  }

  let user;
  try {
    user = await Users.findByPk(creatorId, {raw: true});
  } catch (err) {
    const error = new HttpError("could not find that user.", 401);
    return next(error);
  }

  let userEmail = user.email;

  let specifEvent; 
  try {
    specifEvent = await Events.findByPk(eventId, {raw: true})
  } catch (err) {
    const error = new HttpError("Could not find this event", 500);
    return next(error);
  }
  
  if (event.length > 5) {
    transporter.sendMail({
      to: userEmail,
      from: "events@app.com",
      subject: 
      `Your Event with title ${specifEvent.title} has been reported many times.`,
      html: "<h1>Warning! Please delete the Event.</h1>"
  })
  } 

  res.json({ addedReport });
};

const addComment = async (req, res, next) => {
  const eventId = req.params.eid;
  const { userId, comment } = req.body;

  let addedComment;
  try {
    addedComment = await Comments.build({
      content: comment,
      userId: userId,
      eventId: eventId
    });
  } catch (err) {
    const error = new HttpError("Could not add comment.", 500);
    return next(error);
  }

  try {
    await addedComment.save();
  } catch (err) {
    const error = new HttpError("Could not add comment", 500);
    return next(error);
  }

  res.json({ addedComment });
};

const getComments = async (req, res, next) => {
  const eventId = req.params.eid;

  let comment;
  try {
    comment = await Comments.findAll({
      include: [
        {
          model: Events,
          where: { id: eventId }
        },
        {
          model: Users
        }
      ],
      nest: true,
      raw: true
    });
  } catch (err) {
    const error = new HttpError("could not find comments", 404);
    return next(error);
  }

  res.json({ comment });
};

const deleteComment = async (req, res, next) => {
  const eventId = req.params.eid;
  const commentId = req.params.comid;

  let comment;
  try {
    comment = await Comments.findByPk(commentId, {
      where: { eventId: eventId }
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete comment.",
      500
    );
    return next(error);
  }

  try {
    await comment.destroy();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete comment.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Comment deleted." });
};


exports.getEvents = getEvents;

exports.getEventById = getEventById;

exports.getEventsByUserId = getEventsByUserId;

exports.getEventsByCategory = getEventsByCategory;
exports.getEventsByCategoryId = getEventsByCategoryId;

exports.getEventsByCity = getEventsByCity;
exports.getEventsByCityId = getEventsByCityId;

exports.getEventsByPrefecture = getEventsByPrefecture;
exports.getEventsByPrefectureId = getEventsByPrefectureId;

exports.getEventsByStartDate = getEventsByStartDate;
exports.EventsByStartDate = EventsByStartDate;

exports.createEvent = createEvent;
exports.addReport = addReport;

exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;

exports.getSpecificEvent = getSpecificEvent;

exports.addComment = addComment;
exports.getComments = getComments;

exports.deleteComment = deleteComment;

exports.uploadImage = uploadImage;
