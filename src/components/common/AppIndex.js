import React, { Component } from 'react';
import appIndex from '../../style/img/appIndex.jpg';

export default class NoMatch extends Component{
    render(){
        return(
            <img src={appIndex} alt="首页" style={{width:'100%',overflow:'hidden'}}/>
        )
    }
}