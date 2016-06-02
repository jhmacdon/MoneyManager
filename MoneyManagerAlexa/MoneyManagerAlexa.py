from __future__ import print_function
from urlparse import urlparse
import urllib2
import urllib
import json


def lambda_handler(event, context):
    if event['request']['type'] == "IntentRequest":
        return on_intent(event['request'], event['session'])
    elif event['request']['type'] == "SessionEndedRequest":
        return on_session_ended(event['request'], event['session'])

def on_intent(intent_request, session):
    """ Called when the user specifies an intent for this skill """

    print("on_intent requestId=" + intent_request['requestId'] +
          ", sessionId=" + session['sessionId'])

    intent = intent_request['intent']
    intent_name = intent_request['intent']['name']

    # Dispatch to your skill's intent handlers
    if intent_name == "Transact":
        return run_transaction(intent, session)
    elif intent_name == "Verify":
        return run_verify(intent, session)
    elif intent_name == "Balance":
        return run_balances(intent, session)
    else:
        raise ValueError("Invalid intent")


def on_session_ended(session_ended_request, session):
    print("on_session_ended requestId=" + session_ended_request['requestId'] +
          ", sessionId=" + session['sessionId'])
    # add cleanup logic here

# --------------- Functions that control the skill's behavior ------------------

def getBalance():
    url = 'http://ec2-52-38-142-191.us-west-2.compute.amazonaws.com/api/JLLopzxReuDQcsySY/balances'
    values = { 'pair': 'ETHXBT, ETHUSD, XBTUSD' }
    data = urllib.urlencode(values)
    req = urllib2.Request(url)
    response = urllib2.urlopen(req)
    result = response.read()
    return result
    
def postCharge(typeCharge, user1, user2):
    return null

def postConformation():
    return null

def run_balances(intent, session):
    card_title = intent['name']
    session_attributes = {}
    should_end_session = True
    session_attributes = ""
    speech_output = getBalance()
    reprompt_text = ""
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))

def run_verify(intent, session):
    card_title = intent['name']
    session_attributes = {}
    should_end_session = True
    if 'words' in intent['slots']:
        if (intent['slots']['words']['value'].lower() == "yes"):
            # web goes here
            session_attributes = ""
            speech_output = "okay I will post the transaction"
            reprompt_text = ""
        else:
            session_attributes = ""
            speech_output = "okay I will cancel the transaction"
            reprompt_text = ""
    else:
        speech_output = "I'm not sure what you are trying to say"
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))

def run_transaction(intent, session):
    """ Sets the color in the session and prepares the speech to reply to the
    user.
    """

    card_title = intent['name']
    session_attributes = {}
    should_end_session = False

    if 'User' in intent['slots']:
        if 'UserSecond' in intent['slots']:
            user1 = intent['slots']['User']['value']
            user2 = intent['slots']['UserSecond']['value']
            transactionType = intent['slots']['Transaction']['value']
            dollars = intent['slots']['Dollars']['value']
            cents = intent['slots']['Cents']['value']
            memo = intent['slots']['Memo']['value']
            session_attributes = transactionType
            reprompt_text = "are you sure you want to commit this transaction ?"
            speech_output = user1 + " " + transactionType + " " + user2 + " " + dollars + " dollars " + cents + " cents for " + memo +" "+ reprompt_text
    else:
        speech_output = "I'm not sure what you are trying to say"
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))

# --------------- Helpers that build all of the responses ----------------------


def build_speechlet_response(title, output, reprompt_text, should_end_session):
    return {
        'outputSpeech': {
            'type': 'PlainText',
            'text': output
        },
        'card': {
            'type': 'Simple',
            'title': 'SessionSpeechlet - ' + title,
            'content': 'SessionSpeechlet - ' + output
        },
        'reprompt': {
            'outputSpeech': {
                'type': 'PlainText',
                'text': reprompt_text
            }
        },
        'shouldEndSession': should_end_session
    }


def build_response(session_attributes, speechlet_response):
    return {
        'version': '1.0',
        'sessionAttributes': session_attributes,
        'response': speechlet_response
    }