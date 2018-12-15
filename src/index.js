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
    for (let row of this.state.rows) {
      if (row.getName().length > longestLabel) {
        longestLabel = row.getName().length
      }
      if (row.getName().length < shortestLabel || shortestLabel === 0) {
        shortestLabel = row.getName().length
      }
    }
    for (let col of this.state.cols) {
      if (col.getName().length > longestLabel) {
        longestLabel = col.getName().length
      }
      if (col.getName().length < shortestLabel|| shortestLabel === 0) {
        shortestLabel = col.getName().length
      }
    }
    this.props.updateSummary(
      this.state.rows.length,
      this.state.cols.length,
      0,
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
    let newCols = this.state.cols
    let pos = newCols.indexOf(label)
    newCols.splice(pos, 1)
    this.setState({ cols:newCols })
    this.updateParentSummary()
  }


  updateName(label, name){
    label.setName(name)
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

  updateImage(label, image){

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
        <LabelImage label = {label}/>
        <LabelName label = {label} updateName = {this.updateName}/>
        {buttons}
        <RemoveButton label={label} removeFunction={(lbl) => this.removeRow(lbl)} />
      </tr>
    )
  }

  getButtonsDeleteCol(){
    let btns = []
    for (let label of this.state.cols) {
      btns.push(<RemoveButton label={label} removeFunction={(lbl) => this.removeCol(lbl)}/>)
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
      for (let col of this.state.cols){
        images.push(<LabelImage image = {col.getImage()}/>)
      }
    }
    return images
  }


}

function RadioButton (props){
    return <td>O</td>
}

class RemoveButton extends React.Component{
  label = this.props.label
  removeFunction = this.props.removeFunction

  render(){
    return (
      <td className="button-remove" onClick={() => this.removeFunction(this.label)}>-</td>
    )
  }
}

class LabelName extends React.Component{
  label = this.props.label
  handleChange = this.handleChange.bind(this)
  state = {name: this.label.getName()}

  handleChange(event){
    this.setState({name: event.target.value})
    this.props.updateName(this.label, event.target.value)
  }

  render(){
    let input = <input type="text" onChange={this.handleChange} value={this.state.name}></input>
    return <td>{input}</td>
  }
}

class LabelImage extends React.Component{
  label = this.props.label
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
