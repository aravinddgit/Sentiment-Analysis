import os
import json

import tensorflow as tf
import tensorflow_hub as hub
from flask_cors import CORS
from flask import request
import tensorflow_text
import tweepy
from flask import Flask, jsonify

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

api_key = "U835ijRPxkXWmbg0NOLKxZfsr"
api_secret_key = "j8fP2DZHXjd1MjMftgx5dcmQetrQVSBn4oZT98c1GX3jJFRqEu"

access_token = "4441666752-ijcQpKnqt8VHm66FG6qkftydvRsgOwP73zHmAZf"
access_token_secret = "4QsfP8wXcHv7Mzh3lfpSvCwxp5p3idoxAAdufIlmKEhGf"

class Data:
    def __init__(self, tweet_id, sentiment_score):
        self.tweet_id = tweet_id
        self.sentiment_score = sentiment_score 

app = Flask(__name__)
CORS(app)

@app.route('/',methods = ['POST','GET'])
def index():
        auth_handler = tweepy.OAuthHandler(consumer_key = api_key, consumer_secret = api_secret_key)

        auth_handler.set_access_token(access_token, access_token_secret)

        api = tweepy.API(auth_handler, wait_on_rate_limit=True)

        search_token = request.json.get('topic')

        print(search_token)

        tweet_amount = 20

        tweets = tweepy.Cursor(api.search_tweets,q=search_token, lang = 'en').items(tweet_amount)
        text_tweets = []
        datalist =[]
        tweet_ids = []

        for tweet in tweets:
            text_tweets.append(tweet.text)
            tweet_ids.append(tweet.id)
            print(tweet.id)
 
        model = tf.keras.models.load_model('model_100k_bert_lr3e5.h5',custom_objects = {'KerasLayer':hub.KerasLayer})
        val = model.predict(text_tweets)
        for i,j in zip(tweet_ids,val):
            datalist.append(Data(str(i),str(j[0])))

        return json.dumps([obj.__dict__ for obj in datalist])

if __name__ == "__main__":
    app.run(debug = False)