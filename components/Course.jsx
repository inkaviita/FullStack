const Course = ({list}) => {
    
    const Part = (props) => {
        return (
          <p>
            {props.part} {props.exercises}
          </p>
        )
      }

    const Header = () => {
      return(
        <div>
          <h1>{list.name}</h1>
        </div>
      )
    }

    const Content = () => {
      return (
        <div>
          {list.parts.map(part =>
            <Part part = {part.name} exercises = {part.exercises} />
            )}
        </div>
      )
    }

    const Total = () => {
      const tot = list.parts.reduce((accumulator, currentValue) => accumulator + currentValue.exercises, 0)
      
      return <p>Number of exercises {tot}</p>
    }

    return (
      <div>
        <Header />
        <Content />
        <Total />
      </div>
    )
  }
export default Course