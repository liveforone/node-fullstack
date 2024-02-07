import React from 'react';
import './App.css';
import { Link, Route, Routes } from 'react-router-dom';
import Signup from './users/Signup';
import Login from './users/Login';
import Logout from './users/Logout';
import Withdraw from './users/Withdraw';
import Profile from './users/Profile';
import Home from './Home';
import PostHome from './post/PostHome';
import UpdatePassword from './users/UpdatePassword';
import CreatePost from './post/CreatePost';
import PostDetail from './post/PostDetail';
import UpdatePost from './post/UpdatePost';
import styled from 'styled-components';
import PostSearch from './post/PostSearch';
import PostBelongWriter from './post/PostBelongWriter';
import ReplyBelongPost from './reply/ReplyBelongPost';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

/* global BigInt */

const Container = styled.div`
  background-color: #f0f6fc;
  min-height: 100vh;

  .container {
    max-width: 960px;
    margin: 0 auto;
  }

  .navbar {
    background-color: #e2edf7; /* 연한 파란색 */
    border-radius: 20px; /* 둥글게 만들기 */
    padding: 20px;
  }

  .navbar-brand {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    text-decoration: none;
  }

  .navbar-nav .nav-item {
    margin-right: 10px;
  }

  .navbar-nav .nav-link {
    font-size: 18px;
    color: #333;
    text-decoration: none;
    cursor: pointer;
  }

  .navbar-toggler {
    border: none;
  }

  hr {
    margin: 20px 0;
    border-color: #ddd;
  }
`;

function App() {
  return (
    <Container>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <Link to="/" className="navbar-brand">
            Node Fullstack
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to="/users/signup" className="nav-link">
                  회원가입
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/users/login" className="nav-link">
                  로그인
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/users/profile" className="nav-link">
                  My
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/users/withdraw" className="nav-link">
                  탈퇴
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <br />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users/signup" element={<Signup />} />
          <Route path="/users/login" element={<Login />} />
          <Route path="/users/logout" element={<Logout />} />
          <Route path="/users/profile" element={<Profile />} />
          <Route path="/users/withdraw" element={<Withdraw />} />
          <Route path="/users/update/password" element={<UpdatePassword />} />
          <Route path="/posts" element={<PostHome />} />
          <Route path="/posts/create" element={<CreatePost />} />
          <Route path="/posts" element={<PostDetail />}>
            <Route path=":id" element={<PostDetail />} />
          </Route>
          <Route path="/posts/update" element={<UpdatePost />}>
            <Route path=":id" element={<UpdatePost />} />
          </Route>
          <Route path="/posts/search" element={<PostSearch />}></Route>
          <Route path="/posts/belong-writer" element={<PostBelongWriter />}>
            <Route path=":writerId" element={<PostBelongWriter />} />
          </Route>
          <Route path="/reply/belong-post" element={<ReplyBelongPost />}>
            <Route path=":postId" element={<ReplyBelongPost />} />
          </Route>
        </Routes>
      </div>
    </Container>
  );
}

export default App;
