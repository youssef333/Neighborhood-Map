import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';


let markers= [];

class App extends Component {

	state= {
		venues: [],
		query : '',
		markers: [],
		map: null,
		menu: [],
	}

  	componentDidMount() {
  		this.getVenues()

  		window.gm_authFailure= () => {
      		alert('Error')
    	}
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
        	alert("Please try again later " + error)
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

	this.state.venues.forEach(myVenue => {

		let contentString = `${myVenue.venue.name}`
	    // Marker
	    let marker = new window.google.maps.Marker({
	    	position: myVenue.venue.location,
	    	map: map,
	    	id: myVenue.venue.id,
	    	title: myVenue.venue.name,
	    	animation: window.google.maps.Animation.DROP,
		});
		markers.push(marker);

	    // Change the content when click on marker
		marker.addListener('click', function() {
    		infowindow.open(map, marker);
    		infowindow.setContent(contentString);

    		if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
            } else {
                    marker.setAnimation(window.google.maps.Animation.BOUNCE);
                    setTimeout(() => { marker.setAnimation(null); }, 1000)
            }
  		});
	});	

	const listName = this.state.venues.map(restaurant => restaurant.venue.name)
    // Set state 
    this.setState({
      menu: listName,
      markers: markers,
      map: map
    });
}

	// Open infowindow on click   
    openInfowindow (restaurant){
        this.state.markers.forEach(marker => {
          if(marker.title === restaurant){
          window.google.maps.event.trigger(marker, 'click');
        }
      }) 
    }

	// UpdateQuery
	updateQuery=(query) => {
		const match = new RegExp(escapeRegExp(query), 'i');
	    let listNames = this.state.venues.filter((restaurant) => match.test(restaurant.venue.name));
	    // listNames array match query
	    let restaurantName = listNames.map(restaurant => restaurant.venue.name)
	    if (listNames) {
	      	this.state.markers.forEach(marker => {
	        restaurantName.includes(marker.title) ? marker.setMap(this.state.map) : marker.setMap(null)
	      })
	      	this.setState({ menu: restaurantName })
	    }
	    else {
	      	this.setState({ menu: this.state.venues.map(restaurant => restaurant.venue.name)})
	    }
	    	this.setState({ query:query })
	  	}

  	render() {

  		let showLists;
  		if(this.state.query) {
  			const match = new RegExp(escapeRegExp(this.state.query), "i")
  			showLists = this.state.venues.filter((list) => match.test(list.venue.name))
  		} else {
  			showLists = this.state.venues
  		}
  		showLists.sort(sortBy('venue.name'))

    	return (
      		<main>
	      		<div className="App" >
		      		<div>
			          <section id='navigation' label='navigation'>
			                  <nav className='heading' label='header'>
			                        <header id='header'>NewYork</header>
			                  </nav>
			          </section>
		        		<div id="map" role="application"></div>
		        	</div>
		                
		            <nav id='locationList' aria-label='location-list' tabIndex='0' >
			            <ul className='menu-list'
			                aria-label='list-menu' 
			                id='myUl' 
			                tabIndex='2'
			            >

		                <input type='text'
		                	   className='search' 
		                       id='myInput' 
		                       name='search'
		                       tabIndex='1'
		                       autoComplete='on' 
		                       aria-label='input-search'
		                       placeholder='Search' 
		                       value={this.state.query} 
		                       onChange={(event)=>this.updateQuery(event.target.value)}
		                       onKeyUp={(event)=>this.updateQuery(event.target.value)}
		                />

				       {
				       	showLists.map((element) => ( 
				        <li className='list-item' 
				        	key={element.venue.id}
				        	tabIndex='3'
				        	onChange={(event)=>this.updateQuery(event.target.value)}
				        	onClick={() => this.openInfowindow(element.venue.name)}>
				        >
				        		<a>{element.venue.name}</a>
				        </li>
				        ))
				       }

		            	</ul> 
		           	</nav> 
	           	</div>
     	 	</main>
    	)
  	}
}

	// Load script 
	function loadScript(url) {
		let index  = window.document.getElementsByTagName("script")[0]
	  	let script = window.document.createElement("script")
	  	script.src = url
	  	script.async = true
	  	script.defer = true
	  	index.parentNode.insertBefore(script, index)
	}

export default App;
