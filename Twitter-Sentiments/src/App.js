import './App.css';
import {TwitterTweetEmbed } from 'react-twitter-embed';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { useState } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';

function App() {
  const [loading, setLoading] = useState(false);
  const [tweetData, setTweetData] = useState(null);
  const [topic, setTopic] = useState("");

  const getSentiments = async () => {
    if(topic.length == 0){
      return
    }
    setLoading(true)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: topic })
    };
    const response = await fetch('https://reqres.in/api/posts', requestOptions);
    const data = await response.json();
    console.log(data)

    setTweetData(data)

    setTimeout(() => {
      setLoading(false)
    }, 8000);
  }

  return (
    <div className="App">
      <Container>
        <h1>Twitter Sentiment Analysis</h1>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Enter Tweet Topic</Form.Label>
            <Form.Control onChange={event => {setTopic(event.target.value)}}/>
          </Form.Group>
        </Form>
        <Button variant="primary" onClick={() => {getSentiments();}}>Get Sentiments</Button>
        <hr/>
        {
          loading &&  <Container className='LoadingScreen'>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Container>
        }
        {
          tweetData && <Row>
            {
              tweetData.map((tweet, index) => {
                return <Col key={index}>
                  <TwitterTweetEmbed tweetId={tweet.tweet_id} options={{cards : "hidden"}}/>
                  <div className='RatingDiv'>
                    <span role="img" aria-label="negative">😕</span>
                    <ProgressBar now={(((parseFloat(tweet.sentiment_score) + 10) * 100) / 20)} className="RatingsBar"/>
                    <span role="img" aria-label="positive">😄</span>
                  </div>
                </Col>
              })
            }
          </Row>
        }
        
      </Container>
    </div>
  );
}

export default App;
