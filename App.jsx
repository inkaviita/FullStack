const Header = (props) => {
  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  ) 
}

const Part = ({part, exercises}) => {
  return (
    <p> {part} {exercises}</p>
  )
}

const Content = ({parts}) => {
  return (
    <div>
      <Part part = {parts[0].name} exercises={parts[0].exercises} />
      <Part part = {parts[1].name} exercises={parts[1].exercises} />
      <Part part = {parts[2].name} exercises={parts[2].exercises} />
    </div>
  )
}

const Total = ({props}) => {
  return (
    <div>
      <p>Number of exercises {props[0].exercises + props[1].exercises + props[2].exercises}</p>
    </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  return (
    <div>
      <Header course={course.name}/>
      <Content parts = {course.parts}/>
      <Total props = {course.parts}/>
    </div>
  )
}

export default App