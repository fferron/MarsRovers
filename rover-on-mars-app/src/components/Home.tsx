import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import Create from './rover/Create';

interface IState {
    rovers: any[];
}

export default class Home extends React.Component<RouteComponentProps<any>, IState> {
    constructor(props: RouteComponentProps) {
        super(props); 
        this.state = { 
            rovers: []
        };  
    }

    public componentDidMount(): void {
        axios.get(`http://localhost:5000/rovers`).then(data => {
            this.setState({ rovers: data.data })
        })
    }

    private bringBackHome(id: number) {
        axios.delete(`http://localhost:5000/rovers/${id}`).then(data => {
            const index = this.state.rovers.findIndex(rover => rover.id === id);
            this.state.rovers.splice(index, 1);
            this.props.history.push('/');
        })
    }

    public render() {
        const rovers = this.state.rovers;
        return (
            <div>
                {rovers.length === 0 && (
                    <div className="text-center">
                        <h4>No rover on Mars at the moment</h4>
                    </div>
                )}

                <div className="container">
                <h4> Setup and Launch Rover </h4>

                    <div className='row'>
                        <Create  />
                    </div>

                    <div className="row">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Rover's Name</th>
                                    <th scope="col">Final Position</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rovers && rovers.map(rover =>
                                    <tr key={rover.id}>
                                        <td>{rover.name}</td>
                                        <td>{rover.actual_position}</td>
                                        <td>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="btn-group" style={{ marginBottom: "20px" }}>
                                                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.bringBackHome(rover.id)}>Bring Back Home</button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        )
    }
}
