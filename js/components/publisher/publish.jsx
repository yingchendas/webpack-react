import React from 'react';
import {
    Link,
} from 'react-router';
import {
    Container,
    Group,
    Loader,
    Field,
} from 'amazeui-touch';

const LoaderExample = React.createClass({
    getInitialState() {
        return {
            amStyle: '',
            rounded: false,
        };
    },

    handleChange() {
        this.setState({
            amStyle: this.refs.amStyle.getValue(),
            rounded: !!this.refs.amShape.getValue(),
        });
    },

    render() {
        const {
            amStyle,
        } = this.state;
        let style = {};

        if (amStyle === 'white') {
            style = {
                background: '#0e90d2',
                display: 'block',
            }
        }
        return <div>
            <ul role="nav">
                <li><Link to="/about">About</Link></li>
                <li><Link to="/repos">Repos</Link></li>
            </ul>
        </div>
    }
});

export default LoaderExample;
