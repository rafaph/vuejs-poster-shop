# -*- coding: utf-8 -*-
from __future__ import print_function, unicode_literals

import os
import requests
from dotenv import load_dotenv
from flask import send_file, jsonify
from flask_multistatic import MultiStaticFlask

# load .env variables

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# app configuration

app = MultiStaticFlask(__name__, static_path='')

app.static_folder = [
    os.path.join(app.root_path, 'node_modules'),
    os.path.join(app.root_path, 'assets')
]

if os.environ['PYTHON_ENV'] == 'production':
    app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False

# requests configuration

session = requests.Session()
session.headers.update({
    'Authorization': 'Client-ID %s' % os.environ['IMGUR_CLIENT_ID']
})
url = 'https://api.imgur.com/3/gallery/search/top/0/'

# routes

@app.route('/')
def index():
    return send_file('index.html')

@app.route('/search/<query>')
def search(query):
    response = session.get(url, params={
        'q': query
    })

    if response.status_code == 200:
        data = response.json()
        data = list(
            filter(
                lambda item: not item['is_album'] and not item['nsfw'] and not item['animated'],
                data['data']
            )
        )
        return jsonify(data)
    
    return jsonify({
        'detail': response.text
    }), 400

# initialization

if __name__ == '__main__':
    app.run(
        port=int(os.environ['PORT']),
        debug=os.environ['PYTHON_ENV'] == 'development'
    )
