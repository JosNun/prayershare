import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import Modal from './Modal';

import './CreatePost.css';

import { GET_POSTS } from '../feed/Feed';

const CREATE_POST = gql`
  mutation CreatePost($content: String!) {
    createPost(content: $content) {
      id
      content
      owner
    }
  }
`;

const cancelPost = history => {
  history.push('/feed');
};

let contentField;

export default withRouter(props => (
  <Modal onBgClick={cancelPost.bind(this, props.history)}>
    <Mutation mutation={CREATE_POST}>
      {createPost => (
        <form
          onSubmit={e => {
            e.preventDefault();
            createPost({
              variables: {
                content: contentField.value,
              },
              update: (cache, { data: { createPost: post } }) => {
                const data = cache.readQuery({
                  query: GET_POSTS,
                  variables: {
                    limit: 10,
                    offset: 0,
                  },
                });
                const cachePost = {
                  ...post,
                  partnerCount: 0,
                  isPartnered: false,
                };
                data.getPostFeed.unshift(cachePost);
                cache.writeQuery({
                  query: GET_POSTS,
                  variables: {
                    limit: 10,
                    offset: 0,
                  },
                  data: {
                    ...data,
                    isPartnered: false,
                  },
                });
              },
            });
            contentField.value = '';
            props.history.push('/feed');
          }}
        >
          <textarea
            className="Create-Post-Modal__input"
            ref={node => {
              contentField = node;
            }}
            placeholder="Write your post here."
            required
          />
          <button
            className="Create-Post-Modal__button Create-Post-Modal__button--warning Create-Post-Modal__input"
            onClick={cancelPost.bind(this, props.history)}
          >
            Cancel
          </button>
          <input
            type="submit"
            className="Create-Post-Modal__button Create-Post-Modal__input"
          />
        </form>
      )}
    </Mutation>
  </Modal>
));
