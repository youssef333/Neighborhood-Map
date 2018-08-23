import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Sidebar from './sidebar'

class App extends Component {

	state= {
		venues: [],
		markers: [],
		query : '',
    	menu : []
	}

  	componentDidMount() {
  		this.getVenues()
  	}

  	loadMap= () => {
	    loadScript("https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyAjOff1QTz6msfRK8836nIH1F9Y798txrM&v=3&callback=initMap")
	    window.initMap = this.initMap
	}

	getVenues= () => {
		const endPoint= "https://api.foursquare.com/v2/venues/explore?"
		const parameters= {
			client_id: "LL02KEU5D3IJOKBLR1PCIU31N1IUYEM1LP2U0LCLMXHOC50R",
			client_secret: "INYQ204XRAOYLNCR335JYXOSWLOWECYBSPQPH2T4WMPSMIHP",
			query: "food",
      		near: "NY",
      		v: "20180820"
		}

		axios.get(endPoint + new URLSearchParams(parameters))
      	.then(response => {
      		this.setState({
          		venues: response.data.response.groups[0].items
        }, 	
        	this.loadMap()
        	)
      	})
      	.catch(error => {
        	console.log("Error" + error)
      	})
	}


  	initMap= () => {

    // Map
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.7413549, lng: -73.9980244},
      zoom: 13
    });

    // Infowindow
	const infowindow = new window.google.maps.InfoWindow()

	// Close Infowindow
	map.addListener('click', function(){
		infowindow.close()
	});

	this.state.venues.map(myVenue => {

		let contentString = `${myVenue.venue.name}`

	    // Marker
	    let marker = new window.google.maps.Marker({
	    	position: {lat: myVenue.venue.location.lat, lng: myVenue.venue.location.lng},
	    	map: map,
	    	title: myVenue.venue.name
		});

	    // Change the content when click on marker
		marker.addListener('click', function() {
    		infowindow.open(map, marker);
    		infowindow.setContent(contentString);
  		});
	});
	
}

  	render() {
    	return (
      		<main>
      		<div className="App" >
          <section id='navigation' label='navigation'>
                  <nav className='heading' label='header'>
                        <header id='header'>NewYork</header>
                  </nav>
          </section>
        		<div id="map" role="application"></div>
        	</div>
                <Sidebar />
     	 	</main>
    	)
  	}
}


	function loadScript(url) {
		let index  = window.document.getElementsByTagName("script")[0]
	  	let script = window.document.createElement("script")
	  	script.src = url
	  	script.async = true
	  	script.defer = true
	  	index.parentNode.insertBefore(script, index)
	}

export default App;
