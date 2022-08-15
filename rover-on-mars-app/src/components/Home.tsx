import * as React from 'react';
import axios from 'axios';
import * as engine from '../engine/engine';
import * as commonEnum from '../engine/commonEnum';

export interface IRover {
    id: number,
    name: string,
    actual_position: string,
    actual_direction: string,
}

export interface IError {
    Message: string
}

export interface IFormState {
    [key: string]: any;
    rovers: IRover[];
    movement: string;
    submitSuccess: boolean;
    plateau_dimension: string;
    disabled: boolean;
    plateau: [];
    errors: IError[];
}

export default class Home extends React.Component<any, IFormState> {
    constructor(props: IFormState) {
        super(props);  

        this.state = {
            name: '',
            actual_position: '0 0',  
            actual_direction: commonEnum.DirectionEnum.North,
            movement: '',
            rovers: [],
            submitSuccess: false,
            plateau_dimension: '',
            disabled: false,
            plateau: [],
            errors: []
        };
    }

    private processFormSubmission = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        engine.ValidateMission(this.state); 

        if(this.state.errors.length == 0){

            const formData = {
                name: this.state.name,
                actual_position: this.state.actual_position,
                movement: this.state.movement,
                plateau_dimension: this.state.plateau_dimension
            }

            this.setState({ submitSuccess: true, values: [...this.state.rovers, formData] });

            axios.post(`http://localhost:5000/rovers`, formData).then(data => {
                this.setState({ submitSuccess: false });
            });

            //window.location.reload();
            this.setState({ name: '', actual_position: '', movement: '' });
            

        } else 
        {
            //alert(this.state.errors.find(er => er !== undefined));    
        }
    }

    private handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        this.setState({
            [e.currentTarget.name]: e.currentTarget.value,
        });  
    }

    private savePlateau () {
        this.setState( { disabled: !this.state.disabled } );
    }

    private resetPlateau () {
        this.setState({ plateau_dimension: '' })
        this.setState( { disabled: !this.state.disabled } )
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
            this.setState({ rovers: this.state.rovers });
        })
    }

    public render() {
        const { submitSuccess } = this.state;
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

                            <div className={"col-md-12 form-wrapper"}>
                                    {submitSuccess && alert("Rover was launched successfully!")}

                                    <form id={"create-post-form"} onSubmit={this.processFormSubmission} noValidate={true}>
                                        
                                        <div className="form-group col-md-12">
                                            <label htmlFor="plateau_dimension"> Plateau's Dimension </label>
                                            
                                            <div className='input-group'>
                                                <input type="text" id="plateau_dimension" onChange={(e) => this.handleInputChanges(e)} onBlur={this.savePlateau.bind(this)} value={this.state.plateau_dimension} name="plateau_dimension" required={true} className="form-control" disabled={this.state.disabled} placeholder="Enter plateau value. e.g.: 4 4" />
                                                <div className="input-group-append pull-right">
                                                    <button type="button" className="btn btn-outline-primary" name="reset_btn" id="reset_btn" onClick={this.resetPlateau.bind(this)}>Reset</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group col-md-12">
                                            <label htmlFor="name"> Name </label>
                                            <input type="text" id="name" onChange={(e) => this.handleInputChanges(e)} name="name" className="form-control" placeholder="Enter name. e.g.: Rover 1" />
                                        </div>

                                        <div className="form-group col-md-12">
                                            <label htmlFor="actual_position"> Actual Position </label>
                                            <input type="text" id="actual_position" onChange={(e) => this.handleInputChanges(e)} name="actual_position" className="form-control" placeholder="Enter position. e.g.: 0 0 N" />
                                        </div>

                                        <div className="form-group col-md-12">
                                            <label htmlFor="movement"> Movements </label>
                                            <input type="text" id="movement" onChange={(e) => this.handleInputChanges(e)} name="movement" className="form-control" placeholder="Enter movements. e.g.: RMMLMM" />
                                        </div>

                                        <div className="form-group col-md-12 pull-right">
                                            <button className="btn btn-success" type="submit">
                                                Launch Rover
                                            </button>
                                            {
                                                <span className="fa fa-circle-o-notch fa-spin" />
                                            }
                                        </div>
                                    </form>
                            </div>
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
