import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';

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
        <div class-name = "EditorView">
          <EditorView updateSummary={this.updateSummary}/>
        </div>
        <div className = "SummaryView">
          <SummaryView state={this.state}/>
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
      if (row.getImage() !== null) {
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
      if (col.getImage() !== null) {
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
      <table>
        <tbody>
          <tr>
            <td colSpan="2" rowSpan="2" className="corner-placeholder"></td>
            {this.getColImages()}
            <td className="new-entry-button" rowSpan="2" onClick={() => {this.addNewCol(this.state.cols.length)}}>+</td>
          </tr>
          <tr>
            {this.getColNames()}
          </tr>
          {this.getRows()}
          <tr>
            <td className="new-entry-button" colSpan="2" onClick={() => {this.addNewRow(this.state.rows.length)}}>+</td>
            {this.getButtonsDeleteCol()}
          </tr>
        </tbody>
      </table>
    )
  }


////////////////////// STATE
//
  addNewRow(nr){
    let newRows = this.state.rows
    newRows.push(new Label("row"+nr))
    this.setState({ rows:newRows })
    this.updateParentSummary()
  }

  addNewCol(nr){
    let newCols = this.state.cols
    newCols.push(new Label("col"+nr))
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
    return <td>O</td>
}

class LabelName extends React.Component{
  handleChange = this.handleChange.bind(this)

  handleChange(event){
    this.props.updateName(this.props.label, event.target.value)
  }

  render(){
    let input = <input type="text" onChange={this.handleChange} value={this.props.label.getName()}></input>
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
    let img = <input type="image" alt="uploaded by user" src={this.props.label.getImage()} onClick={this.showFileUpload}/>
    return <td>{fc}{img}</td>
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

  render(){
    return(
      <div>
        <p>summary placeholder</p>
        <p>number of rows: {this.props.state.numberOfRows}</p>
        <p>number of cols: {this.props.state.numberOfCols}</p>
        <p>number of images uploaded: {this.props.state.numberOfUploadedImages}</p>
        <p>longest label: {this.props.state.longestLabel}</p>
        <p>shortest label: {this.props.state.shortestLabel}</p>
      </div>
    )
  }
}


ReactDOM.render(<QuestionEditor />, document.getElementById("root"));
