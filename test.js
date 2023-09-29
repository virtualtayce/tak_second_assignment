/* 
added reading:
- https://medium.com/@iamfaisalkhatri/api-testing-using-supertest-ea37522fa329
- https://www.chaijs.com/guide/styles/
*/

const request = require("supertest")("https://restful-booker.herokuapp.com");
const expect = require("chai").expect;

function generate_random_id(){
    const random_id = Math.floor(Math.random()*10);
    return random_id;
}

var token_auth = {};

describe("Restful Booker Testing", function(){
    it("Verify that the token is successfully created", async function(){
        const response = await request
        .post("/auth")
        .set('Content-Type', 'application/json')
        .send({
            "username": "testing_ground",
            "password": "settingpayload!?%123"
         });
        expect(response.status).to.eql(200);
        expect(response.body.token).not.to.be.null;
        token_auth = response.body.token;
    });
    it("Verify successfully retrieving all booking IDs", async function(){
        this.timeout(2000);
        const response = await request
        .get("/booking")
        .set('Accept', 'application/json')
        .send();
        expect(response.status).to.eql(200);
    });
    it("Verify failing to retrieve all booking IDs - Incorrect URL", async function(){
        const response = await request
        .get("/bookingsss")
        .set('Accept', 'application/json')
        .send();
        expect(response.status).to.eql(404);
    });
    it("Verify succesfully filtering booking IDs with a specific first name", async function(){
        this.timeout(2000);
        const response = await request
        .get("/booking?firstname=Sally")
        .set('Accept', 'application/json')
        .send();
        expect(response.status).to.eql(200);
    });
    it("Verify succesfully filtering booking IDs with a specific last name", async function(){
        this.timeout(2000);
        const response = await request
        .get("/booking?lastname=Brown")
        .set('Accept', 'application/json')
        .send();
        expect(response.status).to.eql(200);
    });
    it("Verify successfully retrieving the booking ID specified", async function(){
        const response = await request
        .get(`/booking/${generate_random_id()}`)
        .set('Accept', 'application/json')
        .send();
        expect(response.status).to.eql(200);
        console.log(`ID used: ${generate_random_id()}`);
    });
    it("Verify that a new booking is succesfully created", async function(){
        this.timeout(2000);
        const response = await request
        .post("/booking")
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({
            "firstname" : "Catherine",
            "lastname" : "Blankcard",
            "totalprice" : 250,
            "depositpaid" : true,
            "bookingdates" : {
                "checkin" : "2023-04-08",
                "checkout" : "2023-04-12"
            },
            "additionalneeds" : "Breakfast"
         });
        expect(response.status).to.eql(200);

        expect(response.body).to.have.property('bookingid');
        expect(response.body).to.have.property('booking');
        expect(response.body.booking).to.have.property('firstname');
        expect(response.body.booking).to.have.property('lastname');
        expect(response.body.booking).to.have.property('totalprice');
        expect(response.body.booking).to.have.property('depositpaid');
        expect(response.body.booking).to.have.property('bookingdates');
        expect(response.body.booking.bookingdates).to.have.property('checkin');
        expect(response.body.booking.bookingdates).to.have.property('checkout');
        expect(response.body.booking).to.have.property('additionalneeds');

        expect(response.body.booking.firstname).to.be.eql("Catherine");
        expect(response.body.booking.lastname).to.be.eql("Blankcard");
        expect(response.body.booking.totalprice).to.be.eql(250);
        expect(response.body.booking.depositpaid).to.be.eql(true);
        expect(response.body.booking.bookingdates.checkin).to.be.eql("2023-04-08");
        expect(response.body.booking.bookingdates.checkout).to.be.eql("2023-04-12");
        expect(response.body.booking.additionalneeds).to.be.eql("Breakfast");

        expect(response.body.booking.bookingdates.checkin).to.have.lengthOf(10);
        expect(response.body.booking.bookingdates.checkout).to.have.lengthOf(10);

        expect(response.body.booking).not.to.be.null;
        expect(response.body.bookingid).not.to.be.null;
    });
});