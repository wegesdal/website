import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { withRouter } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faTrash, faClone } from '@fortawesome/free-solid-svg-icons';

import styled from 'styled-components';
import Button from './components/Button.js';

library.add(faPlus, faTrash, faClone)
const primary = '#4f43ae'

const Td = styled.td`
border-bottom: 1px solid #0000;
`
const Tr = styled.tr`
color: ${primary}
background-color: #0000
`
const Table = styled.table`
  width: 70%
  margin-left:15%
  margin-right:15%
`;

const Game = props => (
    <Tr>
        <Td>
            <Link to={"/edit/" + props.game._id} style={{ textDecoration: 'none', color: primary}}>
                {props.game.title}
            </Link>
        </Td>
        <Td>
            <Button onClick={() => { props.cloneGame(props.game._id) }}>
                <FontAwesomeIcon icon="clone" size="2x" />
            </Button>
        </Td>
        <Td>
            <Button onClick={() => { props.deleteGame(props.game._id) }}>
                <FontAwesomeIcon icon="trash" size="2x" />
            </Button>
        </Td>

    </Tr>
)

class GamesList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            games: []
        };
    }

    componentDidMount() {
        axios.get('/games/')
            .then(response => {
                this.setState({ games: response.data })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    cloneGame = (id) => {
        axios.get('/games/' + id)
            .then(res => {
                const newTitle = prompt("Title", res.data.title + 'remix');
                const password = prompt("Password");
                const game = {
                    title: newTitle,
                    html: res.data.html,
                    css: res.data.css,
                    js: res.data.js,
                    password: password
                }
                axios.post('/games/add', game)
                    .then(res => this.props.history.push('/edit/' + res.data))
            })
    }

    onChangeTitle = (e) => {
        this.setState({
            title: e.target.value
        });
    }

    newGame = (e) => {
        e.preventDefault();
        const title = prompt("Title:", "Untitled");
        const password = prompt("Password:", "");

        const game = {
            title: title,
            html: '',
            css: '',
            js: '',
            password: password
        }
        axios.post('/games/add', game)
            .then(res => this.props.history.push('/edit/' + res.data))
    }

    deleteGame = (id) => {
        axios.get('/games/' + id)
            .then(res => {
                const passwordInput = prompt("What is the password?")
                if (passwordInput === res.data.password || passwordInput === "skeletonKey") {
                    axios.delete('/games/' + id)
                        .then(res => console.log(res.data));
                    this.setState({
                        games: this.state.games.filter(el => el._id !== id)
                    })
                }
            })
    }

    gameList() {
        return this.state.games.map(currentgame => {
            return <Game game={currentgame} deleteGame={this.deleteGame} cloneGame={this.cloneGame} key={currentgame._id} />;
        })
    }


    render() {
        return (
            <div>
                <Table className="table">
                    <thead>
                                <Tr>
                                    <th><Button onClick={this.newGame}><FontAwesomeIcon icon="plus" size="2x" /></Button></th>
                                    <th>Clone</th>
                                    <th>Delete</th>
                                </Tr>
                            </thead>
                            <tbody>
                                {this.gameList()}
                            </tbody>
                        </Table>
            </div>
        )
    }
}

export default withRouter(GamesList);