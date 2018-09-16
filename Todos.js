import React from 'react';
import firebase from 'react-native-firebase';
import { FlatList, Button, View, Text, TextInput } from 'react-native';

import Todo from './Todo';

class Todos extends React.Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('todos');

    this.unsubscribe = null;
    this.state = {
        textInput: '',
        loading: true,
        todos: [],
    };
  }

  updateTextInput(value) {
    this.setState({ textInput: value });
  }

  addTodo() {
    this.ref.add({
      title: this.state.textInput,
      complete: false,
    });
    this.setState({
      textInput: '',
    });
  }

  onCollectionUpdate = (querySnapshot) => {
    const todos = [];
    querySnapshot.forEach((doc) => {
      const { title, complete } = doc.data();
      todos.push({
        key: doc.id,
        doc, // DocumentSnapshot
        title,
        complete,
      });
    });
    this.setState({ 
      todos,
      loading: false,
    });
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate) 
  }

  componentWillUnmount() {
      this.unsubscribe();
  }

  render() {
    if (this.state.loading) {
      return null; // or render a loading icon
    }

    return (
      <View style={{ flex: 1 }}>
          <FlatList
            data={this.state.todos}
            renderItem={({ item }) => <Todo {...item} />}
          />
          <TextInput
              placeholder={'Add TODO'}
              value={this.state.textInput}
              onChangeText={(text) => this.updateTextInput(text)}
          />
          <Button
              title={'Add TODO'}
              disabled={!this.state.textInput.length}
              onPress={() => this.addTodo()}
          />
      </View>
    );
  }
}

export default Todos;
