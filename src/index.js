import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';

let defaultImage = require('./plus.png')
let imageDarkPlus = require('./plus_dark.png')



class QuestionEditor extends React.Component{
  constructor(props){
    super(props)
    this.numberOfRows = 0
    this.numberOfCols = 0
    this.numberOfUploadedImages = 0
    this.longestLabel = 0
    this.shortestLabel = 0
    this.state = {
      numberOfRows: this.numberOfRows,
      numberOfCols: this.numberOfCols,
      numberOfUploadedImages: this.numberOfUploadedImages,
      longestLabel: this.longestLabel,
      shortestLabel: this.shortestLabel
    }
    this.updateSummary = this.updateSummary.bind(this)
  }



  updateSummary(numberOfRows, numberOfCols, numberOfUploadedImages, longestLabel, shortestLabel){
    this.setState({numberOfRows: numberOfRows, numberOfCols: numberOfCols, numberOfUploadedImages: numberOfUploadedImages, longestLabel:  longestLabel, shortestLabel: shortestLabel})
  }


  render(){
    return(
      <main>
          <EditorView updateSummary={this.updateSummary}/>
          <SummaryView state={this.state}/>
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

    this.updateName = this.updateName.bind(this)
    this.updateImage = this.updateImage.bind(this)
  }

  updateParentSummary(){
    let longestLabel = 0
    let shortestLabel = 0
    let numberOfUploadedImages = 0
    for (let row of this.state.rows) {
      if (row.getName().length > longestLabel || longestLabel === 0) {
        longestLabel = row.getName().length
      }
      if (row.getName().length < shortestLabel || shortestLabel === 0) {
        shortestLabel = row.getName().length
      }
      if (row.getImage() !== defaultImage) {
        numberOfUploadedImages++
      }
    }
    for (let col of this.state.cols) {
      if (col.getName().length > longestLabel || longestLabel === 0) {
        longestLabel = col.getName().length
      }
      if (col.getName().length < shortestLabel|| shortestLabel === 0) {
        shortestLabel = col.getName().length
      }
      if (col.getImage() !== defaultImage) {
        numberOfUploadedImages++
      }
    }
    this.props.updateSummary(
      this.state.rows.length,
      this.state.cols.length,
      numberOfUploadedImages,
      longestLabel,
      shortestLabel
    )
  }

  render(){

    return (
      <div className = "editor-view">
        <h2>Question Editor</h2>
        <QuestionText/>
        <table>
          <tbody>
            <tr>
              <td colSpan="2" rowSpan="2" className="corner-placeholder"></td>
              {this.getColImages()}
              <td className="button-new-label" rowSpan="2" onClick={() => {this.addNewCol(this.state.cols.length)}}><img src={imageDarkPlus} alt="button add column"/></td>
            </tr>
            <tr>
              {this.getColNames()}
            </tr>
            {this.getRows()}
            <tr>
              <td className="button-new-label" colSpan="2" onClick={() => {this.addNewRow(this.state.rows.length)}}><img src={imageDarkPlus} alt="button add row"/></td>
              {this.getButtonsDeleteCol()}
            </tr>
          </tbody>
        </table>
      </div>
    )
  }


////////////////////// STATE
//
  addNewRow(nr){
    let newRows = this.state.rows
    newRows.push(new Label("Row "+nr))
    this.setState({ rows:newRows })
    this.updateParentSummary()
  }

  addNewCol(nr){
    let newCols = this.state.cols
    newCols.push(new Label("Column "+nr))
    this.setState({ cols:newCols })
    this.updateParentSummary()
  }

  removeRow(label){
    let newRows = this.state.rows
    let pos = newRows.indexOf(label)
    newRows.splice(pos, 1)
    this.setState({ rows:newRows })
    this.updateParentSummary()
  }

  removeCol(label){
    console.log("rming label " + label.getName())
    let newCols = this.state.cols
    let pos = newCols.indexOf(label)
    console.log("index of lbl: "+pos)
    newCols.splice(pos, 1)
    console.log(newCols)
    this.setState({ cols:newCols })
    this.updateParentSummary()
  }


  updateName(label, name){
    label.setName(name)
    this.updateLabelState(label)
  }

  updateImage(label, image){
    label.setImage(image)
    this.updateLabelState(label)
  }

  updateLabelState(label){
    let index = this.state.rows.indexOf(label)
    if (index !== -1) {
      let newRows = this.state.rows
      newRows[index] = label
      this.setState({rows: newRows})
      this.updateParentSummary()
      return
    }
    index = this.state.cols.indexOf(label)
    if (index !== -1) {
      let newCols = this.state.cols
      newCols[index] = label
      this.setState({cols: newCols})
      this.updateParentSummary()
    }
  }

////////////////////// RENDER
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
        <LabelImage label = {label} updateImage={this.updateImage.bind(this)}/>
        <LabelName label = {label} updateName = {this.updateName}/>
        {buttons}
        <td className="button-remove" onClick={() => this.removeRow(label)}>-</td>
      </tr>
    )
  }

  getButtonsDeleteCol(){
    let btns = []
    for (let label of this.state.cols) {
      btns.push(<td className="button-remove" onClick={() => this.removeCol(label)}>-</td>)
    }
    return btns
  }

  getColNames(){
    let names = []
    if (this.state.cols !== undefined && this.state.cols.length > 0) {
      for (let label of this.state.cols){
          names.push(<LabelName label = {label} updateName = {this.updateName}/>)
      }
    }
    return names
  }

  getColImages(){
    let images = []
    if (this.state.cols !== undefined && this.state.cols.length > 0) {
      for (let label of this.state.cols){
        images.push(<LabelImage label = {label} updateImage={this.updateImage}/>)
      }
    }
    return images
  }


}

function RadioButton (props){
    return <td className="radio-button">O</td>
}

class LabelName extends React.Component{
  handleChange = this.handleChange.bind(this)

  handleChange(event){
    this.props.updateName(this.props.label, event.target.value)
  }

  render(){
    let input = <input type="text" size="10" className="label-name" onChange={this.handleChange} value={this.props.label.getName()}></input>
    return <td>{input}</td>
  }
}

class LabelImage extends React.Component{

  handleChange = this.handleChange.bind(this)
  showFileUpload = this.showFileUpload.bind(this)
  fileUpload = React.createRef()

  showFileUpload(){
    this.fileUpload.current.click()
  }

  handleChange(event){
    this.props.updateImage(this.props.label, URL.createObjectURL(event.target.files[0]))
  }

  render(){
    let fc = <input ref={this.fileUpload} className="image-upload" type="file" onChange={this.handleChange}></input>
    let img = <input className="image-display" type="image" alt="Upload Image" src={this.props.label.getImage()} onClick={this.showFileUpload}/>
    return <td>{fc}{img}</td>
  }
}


class Label{
  constructor(name){
    this.name = name
    this.image = defaultImage
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

class QuestionText extends React.Component{
  state = {question: ""}
  handleChange = this.handleChange.bind(this)

  handleChange(event){
    this.setState({question: event.target.value})
  }

  render(){
    let value
    let size
    if (this.state.question !== "") {
      value = this.state.question
      size = this.state.question.length+5
    } else{
      value = ""
      size = 25
    }
    return(
      <input
        type="text"
        size={size}
        className="question"
        onChange={this.handleChange}
        value={value}
        placeholder= "Enter your Question here"
      ></input>
    )
  }
}

class SummaryView extends React.Component{

  render(){
    return(
      <div className="summary-view">
        <h2>Question Stats</h2>
        <p>Number of Rows: {this.props.state.numberOfRows}</p>
        <p>Number of Columns: {this.props.state.numberOfCols}</p>
        <p>Number of Images uploaded: {this.props.state.numberOfUploadedImages}</p>
        <p>Longest Label: {this.props.state.longestLabel}</p>
        <p>Shortest Label: {this.props.state.shortestLabel}</p>
      </div>
    )
  }
}


ReactDOM.render(<QuestionEditor />, document.getElementById("root"));
