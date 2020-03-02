const express = require('express');
const { check } = require('express-validator');

const eventsControllers = require('../controllers/events-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// ΕΠΙΣΤΡΕΦΕΙ ΟΛΑ ΤΑ EVENTS 
router.get('/', eventsControllers.getEvents);
// ΕΠΙΣΤΡΕΦΕΙ ΕΝΑ ΣΥΓΚΕΚΡΙΜΕΝΟ EVENT ΜΕΣΩ ΤΟΥ ID ΤΟΥ
router.get('/:eid', eventsControllers.getEventById);
// ΕΠΙΣΤΡΕΦΕΙ ΤA EVENTS ΠΟΥ ΕΧΕΙ ΔΗΜΙΟΥΡΓΗΣΕΙ Ο ΣΥΓΚΕΚΡΙΜΕΝΟΣ USER
router.get('/user/:uid', eventsControllers.getEventsByUserId);
// ΕΠΙΣΤΡΕΦΕΙ ΣΥΓΚΕΚΡΙΜΕΝΟ EVENT
router.get('/specific/:eid', eventsControllers.getSpecificEvent);
// ΕΠΙΣΤΡΕΦΕΙ ΟΛΑ ΤΑ EVENTS ΠΟΥ ΑΝΗΚΟΥΝ ΣΤΗ ΣΥΓΚΕΚΡΙΜΕΝΗ ΚΑΤΗΓΟΡΙΑ
router.post('/category/', eventsControllers.getEventsByCategory);
router.get('/category/:catid', eventsControllers.getEventsByCategoryId);
// ΕΠΙΣΤΡΕΦΕΙ ΟΛΑ ΤΑ EVENTS ΠΟΥ ΓΙΝΟΝΤΑΙ ΣΤΗ ΣΥΓΚΕΚΡΙΜΕΝΗ ΠΟΛΗ
router.post('/city', eventsControllers.getEventsByCity);
router.get('/city/:ctid',  eventsControllers.getEventsByCityId);
// ΕΠΙΣΤΡΕΦΕΙ ΟΛΑ ΤΑ EVENTS ΠΟΥ ΓΙΝΟΝΤΑΙ ΣΤΟ ΣΥΓΚΕΚΡΙΜΕΝΟ ΝΟΜΟ
router.post('/prefecture', eventsControllers.getEventsByPrefecture);
router.get('/prefecture/:prefid', eventsControllers.getEventsByPrefectureId);
// ΕΠΙΣΤΡΕΦΕΙ ΟΛΑ ΤΑ EVENTS ΠΟΥ ΑΡΧΙΖΟΥΝ ΤΗ ΣΥΓΚΕΚΡΙΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ
router.post('/startdate', eventsControllers.getEventsByStartDate);
router.get('/startdate/:date', eventsControllers.EventsByStartDate);
// ΕΠΙΣΤΡΕΦΕΙ ΤΑ COMMENTS
router.get('/comment/:eid', eventsControllers.getComments);

// ΔΕΧΕΤΑΙ ΕΝΑ ARRAY ΜΕ ΕΙΚΟΝΕΣ
router.post('/image', fileUpload.array('images'), eventsControllers.uploadImage);
// MIDDLEWARE ΓΙΑ ΤΗΝ ΑΣΦΑΛΕΙΑ ΤΩΝ REQUESTS (AUTHORIZATION)
router.use(checkAuth);

// ΔΗΜΙΟΥΡΓΕΙ ΕΝΑ EVENT
router.post(
    '/',
    [
        check('title').not().isEmpty(),
        check('description').isLength({min: 5}),
        check('address').not().isEmpty(),
        check('city').not().isEmpty(),
        check('prefecture').not().isEmpty(),
        check('category').not().isEmpty(),
        check('startDate').not().isEmpty(),
        check('endDate').not().isEmpty(),
        check('startTime').not().isEmpty()
    ],
    eventsControllers.createEvent
);
// ΠΡΟΣΘΕΤΕΙ REPORT 
router.post('/report/:eid',eventsControllers.addReport);
// ΠΡΟΣΘΕΤΕΙ COMMENTS 
router.post(
    '/comment/:eid',
    [
        check('content').isLength({min: 3})
    ],
    eventsControllers.addComment);
// ΔΙΑΓΡΑΦΕΙ ΕΝΑ COMMENT
router.delete('/comment/:comid/event/:eid', eventsControllers.deleteComment);
// ΑΛΛΑΖΕΙ ΤΑ ΣΤΟΙΧΕΙΑ ΕΝΟΣ EVENT
router.patch(
    '/:eid',
    [
        check('title').not().isEmpty(),
        check('address').not().isEmpty(),
        check('startDate').not().isEmpty(),
        check('endDate').not().isEmpty(),
        check('startTime').not().isEmpty(),
        check('description').isLength({min: 5})
    ],
    eventsControllers.updateEvent);
// ΔΙΑΓΡΑΦΕΙ ΕΝΑ EVENT
router.delete('/:eid', eventsControllers.deleteEvent);

module.exports = router;