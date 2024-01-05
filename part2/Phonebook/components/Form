import Button from "./Button";

const Form = ({ newName, newNumber, setNewName, setNewNumber, Click }) => {
    return (
      <form onSubmit={Click}>
        <h1>add a new</h1>
        <div>
          name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
        </div>
        <Button text="add" />
      </form>
    );
  };

export default Form
