import React from 'react'

export default function AboutUs() {
  return (
    <>
    <header className="about-header">
      <h1>
        Special Night? Friends Coming Over? 
        <br></br>Nothing to watch?
      </h1>
	  </header>
	
	<main>

		  <p className = "first_paragraph"> 
        Created by 6 first-year computer science students, Our website aims to recommend a movie for you to watch based on your mood and situation. 
        <br></br>
        We have implemented an algorithm designed to help you pick the best movie to watch based on your mood.
      </p>

      <br></br>
      
      <p className = "second_paragraph"> 
      → Have a go at answering 10 multiple choice questions, each of which will help us make you a better recommendation 
        <br></br> <br></br>
        ↻ Alternatively choose a movie at random (from our catalogue of 10,000+ movies) if you have no preferences 
        <br></br> <br></br>
        ⇈ Or, Have a look at our Top Rated movies, that have been filtered by its popularity   
      </p>

      <br></br>

		  <p className = "third_paragraph"> 
      If you experience any bugs or errors on our website, you can contact us using the form below: 
      </p>


      <h2>
        <form className="about-form" action='https://formsubmit.co/namodaju@mailgolem.com'method='post' encType='text/plain'>
          <input className="about-input" type="text" name="firstname" placeholder="First Name*" required></input>
          <br></br>
          <input className="about-input" type="text" name="fullname" placeholder="Last Name (optional)"></input>
          <br></br>
          <input className="about-input" type="email" name="email" placeholder="Email Address*" required></input>
          <br></br>
          <textarea className="about-textarea" name="message" placeholder="Enter your message here* (Please be respectful)" required></textarea>
          <br></br>
          <button className="about-button" type="submit">Submit</button>
        </form>
      </h2>

	</main>
  </>
  )
}
