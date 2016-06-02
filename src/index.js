/**
 Copyright 2016 DevTheory, LLC. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
 or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Big-O Buddy about the shell sort algorithm."
 *  Alexa: "(reads back information about the time/space complexity of shell sort)"
 */

'use strict';

var AlexaSkill = require('./AlexaSkill'),
    dsAlgos = require('./dsAlgos');

var APP_ID = 'amzn1.echo-sdk-ams.app.b1482967-a3f5-4945-bb74-ada0a516ef22'; 

/**
 * BigOBuddy is a child of AlexaSkill.
 */
var BigOBuddy = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
BigOBuddy.prototype = Object.create(AlexaSkill.prototype);
BigOBuddy.prototype.constructor = BigOBuddy;

BigOBuddy.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to Big-O Buddy. You can ask a question like, what's the complexity of the shell sort algorithm? ... Now, what can I help you with.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

BigOBuddy.prototype.intentHandlers = {
    "DsAlgoIntent": function (intent, session, response) {
        var dsAlgoSlot = intent.slots.DsAlgo,
            dsAlgoName;
        if (dsAlgoSlot && dsAlgoSlot.value){
            dsAlgoName = dsAlgoSlot.value.toLowerCase();
        }

        var cardTitle = "Definition for " + dsAlgoName,
            dsAlgo = dsAlgos[dsAlgoName],
            speechOutput,
            repromptOutput;
        if (dsAlgo) {
            speechOutput = {
                speech: dsAlgo,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.tellWithCard(speechOutput, cardTitle, dsAlgo);
        } else {
            var speech;
            if (dsAlgoName) {
                speech = "I'm sorry, I currently do not know " + dsAlgoName + ". What else can I help with?";
            } else {
                speech = "I'm sorry, I currently do not know that. What else can I help with?";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            repromptOutput = {
                speech: "What else can I help with?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "You can ask questions about the space/time complexity of data structures and algorithms such as, what's the complexity for heapsort, or, you can say exit... Now, what can I help you with?";
        var repromptText = "You can say things like, what's the complexity of bubblesort, or you can say exit... Now, what can I help you with?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
};

exports.handler = function (event, context) {
    var dsAlgo = new BigOBuddy();
    dsAlgo.execute(event, context);
};
