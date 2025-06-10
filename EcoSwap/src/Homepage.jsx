// src/components/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./homepage.css";

export default function Homepage() { 
  return (
    <div className="homepage">
      <header className="header">
        <img src="/images/logo.png" alt="EcoSwap Logo" className="logo" />
        <div className="auth-buttons">
          <button className="login">Log In</button>
          <button className="register">Register</button>
        </div>
      </header>

      <section className="hero">
        <h1>Swap and Save on Sustainable Goods</h1>
        <input type="text" placeholder="Search items..." className="search-bar" />
      </section>

      <section className="categories">
        <h2>Browse Categories</h2>
        <div className="category-list">
          <div className="category">
            <img src="/images/wooden-pen-holder.jpg" alt="Furniture" />
            <span>Furniture</span>
          </div>
          <div className="category">
            <img src="/images/vase.jpg" alt="Vase" />
            <span>Vase</span>
          </div>
          <div className="category">
            <img src="/images/rug.jpg" alt="Rug" />
            <span>Rug</span>
          </div>
          <div className="category">
            <img src="/images/lamp.jpg" alt="Lamp" />
            <span>Lamp</span>
          </div>
        </div>
      </section>

      <section className="trending">
        <h2>Trending Items</h2>
        <div className="items">
          <div className="item">
            <img src="/images/decor1.jpg" alt="Wooden Table" />
            <p>Wooden Table</p>
            <span>Location</span>
          </div>
          <div className="item">
            <img src="/images/decor2.jpg" alt="Artificial Plant" />
            <p>Artificial Plant</p>
            <span>Location</span>
          </div>
          <div className="item">
            <img src="/images/decor3.jpg" alt="Vintage Vase" />
            <p>Vintage Vase</p>
            <span>Location</span>
          </div>
          <div className="item">
            <img src="/images/decor4.jpg" alt="Decorative Rug" />
            <p>Decorative Rug</p>
            <span>Location</span>
          </div>
        </div>
      </section>

      <footer className="footer">© 2025 EcoSwap</footer>
    </div>
  );
}
 