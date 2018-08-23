import React, {Component} from 'react';

class sidebar extends Component {

    closeNav() {
        document.getElementById("locationList").style.display = "none";
    }


    render(){

    function myFunction() {
    // Declare variables
    var input, filter, ul, li, a, i;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

        return (
            <nav id = 'locationList' aria-label = 'location-list' >
            <div className='hamburger-menu' aria-label = 'hamburger-menu'>
                
                <div className="menu"></div>
                <div className="menu"></div>
                <div className="menu"></div>
            </div>
            <ul className='menu-list' label='list-menu' id='myUl'>         
                <input type='text' id='myInput' onKeyUp='myFunction()' name='search' label='input-search' placeholder='Search'/>
                
                    <li className='link' role='button'>
                        <a className="closebtn" onClick={this.closeNav}>&times;</a>
                    </li>  
            </ul> 
           </nav> 
        )
    }
}

export default sidebar; 