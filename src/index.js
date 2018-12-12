import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';

class QuestionEditor extends React.Component{
  constructor(props) {
    super(props)
  }
  /*numberOfRows= 0
  numberOfCols = 0
  numberOfUploadedImages = 0
  longestLabel = null
  shortestLabel = null*/



  render(){
    return(
      <main>
        <div class-name = "EditorView">
          <EditorView/>
        </div>
        <div className = "SummaryView">
          <SummaryView/>
        </div>
      </main>
    )
  }

}

class EditorView extends React.Component{
  constructor(props){
    super(props)
    let rows = []
    let cols = []
    this.state = {rows, cols}
  }

  render(){
    return (
      <table>
        <tbody>
          <tr>
            <td colSpan="2" rowSpan="2" className="corner-placeholder"></td>
            {this.getColImages()}
            <td className="new-entry-button" onClick={() => {this.addNewCol()}}>+</td>
          </tr>
          <tr>
            {this.getColNames()}
          </tr>
          {this.getRows()}
          <tr>
            <td className="new-entry-button" onClick={() => {this.addNewRow()}}>+</td>
          </tr>
        </tbody>
      </table>
    )
  }

  addNewRow(){
    let newRows = this.state.rows
    newRows.push(new Label("row"))
    this.setState({ rows:newRows });
  }

  addNewCol(){
    let newCols = this.state.cols
    newCols.push(new Label("col"))
    this.setState({ cols:newCols });
  }

  getRows(){
    let rows = []
    for (let label of this.state.rows){
      rows.push(this.getRow(label))
    }
    return rows
  }

  getRow(label){
    let buttons = []
    for (let i = 0; i < this.state.cols.length; i++){
      buttons.push(<RadioButton/>)
    }
    return(
      <tr>
        <LabelImage image = {label.getImage()}/>
        <LabelName name = {label.getName()}/>
        {buttons}
      </tr>
    )
  }

  getColNames(){
    let names = []
    if (this.state.cols !== undefined && this.state.cols.length > 0) {
      for (let label of this.state.cols){
          names.push(<LabelName name = {label.getName()} />)
      }
    }
    return names
  }

  getColImages(){
    let images = []
    if (this.state.cols !== undefined && this.state.cols.length > 0) {
      for (let label of this.state.cols){
        images.push(<LabelImage image = {label.getImage()}/>)
      }
    }
    return images
  }


}

function RadioButton (props){
    return <td>O</td>
}

class LabelName extends React.Component{
  render(){
    return <td>name</td>
  }
}

class LabelImage extends React.Component{
  render(){
    return <td>img</td>
  }
}


class Label{
  constructor(name){
    this.name = name
    this.image = null
  }

  setName (name){
    this.name = name
  }

  setImage(image){
    this.image = image
  }

  getName(){
    return this.name
  }
  getImage(){
    return this.image
  }

}

class SummaryView extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
      <p>summary placeholder</p>
    )
  }
}


ReactDOM.render(<QuestionEditor />, document.getElementById("root"));
