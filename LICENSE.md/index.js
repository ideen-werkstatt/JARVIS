"use strict";

var STATES = {
    VORSITZENDER: "_VORSITZENDER",
    VORSTAND: "_VORSTAND",
    VORSTAND_FAKT: "_VORSTAND_FAKT",
    HELP: "_HELPMODE",
    MAIN: "_MAIN"
};

var AUSGABEN = {
    HELP_MESSAGE: "Wie kann ich ihnen helfen?",
    CANCEL_MESSAGE: "Auf Wiedersehen.",
    HELP_UNHANDLED: "Sagen Sie Ja zum Fortfahren und Nein zum Beenden.",
    VORSITZENDER_UNHANDLED: "Wollen Sie wissen, wer der Vorstandsvorsitzende des Alte Leipziger Hallesche Konzerns ist?",
    VORSTAND_UNHANDLED: "Wollen Sie wissen, wer im Vorstand des Alte Leipziger Hallesche Konzerns ist?"
};

var Alexa = require("alexa-sdk");
var APP_ID = undefined;

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(newSessionHandlers, mainStateHandlers, vorsitzenderStateHandlers, vorstandStateHandlers, vorstandFaktStateHandlers, helpStateHandlers);
    alexa.execute();
};

var newSessionHandlers = {
    "GetVorstandsvorsitzender": function () {
        this.handler.state = STATES.VORSITZENDER;
        this.emitWithState("GetVorstandsvorsitzender");
    },
    "GetVorstand": function () {
        this.handler.state = STATES.VORSTAND;
        this.emitWithState("GetVorstand");
    },
    "GetVorstandFakt": function () {
        this.handler.state = STATES.VORSTAND_FAKT;
        this.emitWithState("GetVorstandFakt");
    },
    "LaunchRequest": function () {
        console.log(`LAUNCH REQUEST`);
        var speechOutput = "Willkommen im neuen Alexa Skill des Alte Leipziger Hallesche Konzerns";
        this.emit(":tell", speechOutput, speechOutput);
    },
    "AMAZON.HelpIntent": function() {
        this.handler.state = STATES.HELP;
        this.emitWithState("helpTheUser", true);
    },
    "Unhandled": function () {
        var speechOutput = "Willkommen im neuen Alexa Skill des Alte Leipziger Hallesche Konzerns";
        this.emit(":ask", speechOutput, speechOutput);
    }
};

var mainStateHandlers = Alexa.CreateStateHandler(STATES.MAIN, {
    "GetVorstandsvorsitzender": function () {
        this.handler.state = STATES.VORSITZENDER;
        this.emitWithState("GetVorstandsvorsitzender");
    },
    "GetVorstand": function () {
        this.handler.state = STATES.VORSTAND;
        this.emitWithState("GetVorstand");
    },
    "GetVorstandFakt": function () {
        this.handler.state = STATES.VORSTAND_FAKT;
        this.emitWithState("GetVorstandFakt");
    },
    "LaunchRequest": function () {
        console.log(`LAUNCH REQUEST`);
        var speechOutput = "Willkommen im neuen Alexa Skill des Alte Leipziger Hallesche Konzerns";
        this.emit(":tell", speechOutput, speechOutput);
    },
    "AMAZON.HelpIntent": function() {
        this.handler.state = STATES.HELP;
        this.emitWithState("helpTheUser", true);
    },
    "Unhandled": function () {
        var speechOutput = "Willkommen im neuen Alexa Skill des Alte Leipziger Hallesche Konzerns";
        this.emit(":ask", speechOutput, speechOutput);
    }
});

var vorsitzenderStateHandlers = Alexa.CreateStateHandler(STATES.VORSITZENDER, {
    "GetVorstandsvorsitzender": function () {
        var speechOutput = "Der Vorstandsvorsitzende des Alte Leipziger Hallesche Konzerns ist Herr Doktor Walter Botermann.";
        this.emit(":tell", speechOutput, speechOutput);
    },
    "Unhandled": function () {
        var speechOutput = AUSGABEN.VORSITZENDER_UNHANDLED;
        this.emit(":ask", speechOutput, speechOutput);
    },
    "AMAZON.YesIntent": function() {
        this.emitWithState("GetVorstandsvorsitzender");
    },
    "AMAZON.NoIntent": function() {
    	var speechOutput = "Dann eben nicht, nach deinem hat auch niemand gefragt.";
        this.emit(":tell", speechOutput, speechOutput);
    },
    "SessionEndedRequest": function () {
        console.log("Session ended in vorsitzender state: " + this.event.request.reason);
    }
});

var vorstandStateHandlers = Alexa.CreateStateHandler(STATES.VORSTAND, {
    "GetVorstand": function () {
        this.attributes.unhandled = false;
        var vorstandOutput = "Im Vorstand des Alte Leipziger Hallesche Konzerns sind Herr Doktor Walter Botermann, Herr Bohn, Herr Kettnacker, Frau Pekarek, Herr Rohm und Herr Doktor Bierbaum. ";
        var questionOutput = "Möchten Sie mehr über ein Vorstandsmitglied erfahren?";
        var speechOutput = vorstandOutput + questionOutput;
        this.emit(":ask", speechOutput, speechOutput);
    },
    "AMAZON.RepeatIntent": function () {
        var speechOutput = this.attributes.speechOutput;
    	var repromptText = this.attributes.repromptText;
        this.emit(":ask", speechOutput, repromptText);
    },
    "AMAZON.HelpIntent": function() {
        this.emitWithState("helpTheUser");
    },
    "AMAZON.CancelIntent": function () {
        this.emit(":tell", AUSGABEN.CANCEL_MESSAGE);
    },
    "Unhandled": function () {
    	this.attributes.unhandled = true;
        var speechOutput = AUSGABEN.VORSTAND_UNHANDLED;
        this.emit(":ask", speechOutput, speechOutput);
    },
    "AMAZON.YesIntent": function() {
    	if (this.attributes.unhandled === false) {
    		this.handler.state = STATES.VORSTAND_FAKT;
    		this.emitWithState("GetVorstandFaktAuswahl");
    	} else {
        	this.emitWithState("GetVorstand");
    	}
    },
    "AMAZON.NoIntent": function() {
		if (this.attributes.unhandled === false) {
    		var speechOutput = "Ok.";
    		this.handler.state = STATES.MAIN;
        	this.emit(":tell", speechOutput);
    	} else {
        	var schnippischOutput = "Ich sage es ihnen trotzdem, im Vorstand des Alte Leipziger Hallesche Konzerns sitzen alle Vorstandsmitglieder des Konzerns";
        	this.handler.state = STATES.MAIN;
        	this.emit(":tell", schnippischOutput);
    	}
    },
    "SessionEndedRequest": function () {
        console.log("Session ended in vorstand state: " + this.event.request.reason);
        this.handler.state = STATES.MAIN;
        this.emitWithState("SessionEndedRequest");
    }
});

var vorstandFaktStateHandlers = Alexa.CreateStateHandler(STATES.VORSTAND_FAKT, {
    "GetVorstandFaktAuswahl": function () {
	    var questionOutput = "Über welches Vorstandsmitglied möchten Sie mehr erfahren?";
    	this.emit(":ask", questionOutput, questionOutput);
    },
    "GetVorstandFakt": function () {
    	if (this.event.request.intent.slots.Vorstand !== undefined){
    	    this.handler.state = STATES.MAIN;
    		handleVorstandRequest.call(this);
    	}
    },
    "AMAZON.RepeatIntent": function () {
        var speechOutput = this.attributes.speechOutput;
    	var repromptText = this.attributes.repromptText;
        this.emit(":ask", speechOutput, repromptText);
    },
    "AMAZON.HelpIntent": function() {
        this.handler.state = STATES.HELP;
        this.emitWithState("helpTheUser");
    },
    "AMAZON.CancelIntent": function () {
        this.emit(":tell", AUSGABEN.CANCEL_MESSAGE);
    },
    "Unhandled": function () {
        var speechOutput = AUSGABEN.VORSTAND_UNHANDLED;
        this.emit(":ask", speechOutput, speechOutput);
    },
    "SessionEndedRequest": function () {
        console.log("Session ended in vorstand_fakt state: " + this.event.request.reason);
    }
});

var helpStateHandlers = Alexa.CreateStateHandler(STATES.HELP, {
    "helpTheUser": function () {
        var speechOutput = "Willkommen im neuen Alexa Skill des Alte Leipziger Hallesche Konzerns";
        this.emit(":ask", speechOutput, speechOutput);
    },
    "AMAZON.RepeatIntent": function () {
        this.emitWithState("helpTheUser");
    },
    "AMAZON.HelpIntent": function() {
        this.emitWithState("helpTheUser");
    },
    "AMAZON.CancelIntent": function () {
        this.emit(":tell", AUSGABEN.CANCEL_MESSAGE);
    },
    "Unhandled": function () {
        var speechOutput = AUSGABEN.HELP_UNHANDLED;
        this.emit(":ask", speechOutput, speechOutput);
    },
    "AMAZON.YesIntent": function() {
        this.emit("LaunchRequest");
    },
    "AMAZON.NoIntent": function() {
        this.emit(":tell", AUSGABEN.CANCEL_MESSAGE);
    },
    "SessionEndedRequest": function () {
        console.log("Session ended in help state: " + this.event.request.reason);
    }
});

function handleVorstandRequest() {
	var vorstand = this.event.request.intent.slots.Vorstand.value;
	
    if(vorstand.indexOf("botermann") !== -1){
		var speechOutput = "Doktor Walter Botermann wurde am 12. Juni 1953 in Neuss geboren. Seit 2006 ist er im Vorstand des Alte Leipziger Hallesche Konzerns tätig. Seit Juni 2009 ist er Vorstandsvorsitzender des Alte Leipziger Hallesche Konzerns.";
		var cardTitle = "Dr. Walter Botermann";
		var cardContent = "Dr. Walter Botermann wurde am 12. Juni 1953 in Neuss geboren. Seit 2006 ist er im Vorstand des Alte Leipziger Hallesche Konzerns tätig. Seit Juni 2009 ist er Vorstandsvorsitzender des Alte Leipziger Hallesche Konzerns.";
		var imageObj = "www.alte-leipziger.de/unternehmen-al/ueberblick-al/botermann-80x100.jpg";
		
		this.emit(':tellWithCard', speechOutput, cardTitle, cardContent, imageObj);
	}
	if(vorstand.indexOf("bohn") !== -1){
		var speechOutput = "Christoph Bohn wurde am 01. November 1963 in Bonn geboren. Seit 2007 ist er im Vorstand des Alte Leipziger Hallesche Konzerns tätig.";
		var cardTitle = "Christoph Bohn";
		var cardContent = "Christoph Bohn wurde am 01. November 1963 in Bonn geboren. Seit 2007 ist er im Vorstand des Alte Leipziger Hallesche Konzerns tätig.";
		var imageObj = "www.alte-leipziger.de/unternehmen-al/ueberblick-al/bohn-80x100.jpg"
		
		this.emit(':tellWithCard', speechOutput, cardTitle, cardContent, imageObj);
	}
	if(vorstand.indexOf("kettnaker") !== -1){
		var speechOutput = "Frank Kettnaker wurde am 05. Dezember 1965 in Gerolstein geboren. Seit 2007 ist er im Vorstand des Alte Leipziger Hallesche Konzerns tätig.";
		var cardTitle = "Frank Kettnaker";
		var cardContent = "Frank Kettnaker wurde am 05. Dezember 1965 in Gerolstein geboren. Seit 2007 ist er im Vorstand des Alte Leipziger Hallesche Konzerns tätig.";
		var imageObj = "www.alte-leipziger.de/unternehmen-al/ueberblick-al/kettnaker-80x100.jpg"
		
		this.emit(':tellWithCard', speechOutput, cardTitle, cardContent, imageObj);
	}
	if(vorstand.indexOf("pekarek") !== -1){
		var speechOutput = "Wiltrud Pekarek wurde am 02. Juli 1961 in Geislingen geboren. Seit 2004 ist sie im Vorstand des Alte Leipziger Hallesche Konzerns tätig.";
		var cardTitle = "Wiltrud Pekarek";
		var cardContent = "Wiltrud Pekarek wurde am 02. Juli 1961 in Geislingen geboren. Seit 2004 ist sie im Vorstand des Alte Leipziger Hallesche Konzerns tätig.";
		var imageObj = "www.alte-leipziger.de/unternehmen-al/ueberblick-al/pekarek-80x100.jpg"
		
		this.emit(':tellWithCard', speechOutput, cardTitle, cardContent, imageObj);
	}
	if(vorstand.indexOf("rohm") !== -1){
		var speechOutput = "Martin Rohm wurde am 07. Juli 1962 in Höxter geboren. Seit 2013 ist er im Vorstand des Alte Leipziger Hallesche Konzerns tätig.";
		var cardTitle = "Martin Rohm";
		var cardContent = "Martin Rohm wurde am 07. Juli 1962 in Höxter geboren. Seit 2013 ist er im Vorstand des Alte Leipziger Hallesche Konzerns tätig.";
		var imageObj = "www.alte-leipziger.de/unternehmen-al/ueberblick-al/rohm-martin-80x100-internet-klein.jpg"
		
		this.emit(':tellWithCard', speechOutput, cardTitle, cardContent, imageObj);
	}
	if(vorstand.indexOf("bierbaum") !== -1){
		var speechOutput = "Doktor Jürgen Bierbaum wurde am 12. Februar 1967 in Neckarsulm geboren. Seit 2016 ist er im Vorstand des Alte Leipziger Hallesche Konzerns tätig.";
		var cardTitle = "Dr. Jürgen Bierbaum";
		var cardContent = "Dr. Jürgen Bierbaum wurde am 12. Februar 1967 in Neckarsulm geboren. Seit 2016 ist er im Vorstand des Alte Leipziger Hallesche Konzerns tätig.";
		var imageObj = "www.alte-leipziger.de/unternehmen-al/ueberblick-al/dr-bierbaum-juergen80x100.jpg"
		
		this.emit(':tellWithCard', speechOutput, cardTitle, cardContent, imageObj);
	}
}
