import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import axios from "axios";
import "./index.css";

function App() {
  const [data, setData] = useState("Not Found");
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

  const getBookByISBN = (isbn) => {
    return axios
      .get(`https://www.googleapis.com/books/v1/volumes?q=${isbn}+isbn`)
      .then(({ data: { items } }) => {
        if (!items) {
          setError("No books found");
        } else {
          const books = [];

          items.forEach(({ id, volumeInfo }) => {
            console.log(volumeInfo);
            const book = {
              id,
              title: volumeInfo.title,
              authors: volumeInfo.authors,
              publisher: volumeInfo.publisher,
              publishedDate: volumeInfo.publishedDate,
              description: volumeInfo.description,
              genres: volumeInfo.categories,
              images: volumeInfo.imageLinks,
            };
            books.push(book);
          });
          setBooks(books);
        }
      });
  };

  useEffect(() => {
    if (data !== "Not Found") {
      getBookByISBN(data);
    }
  });

  return (
    <div className="App">
      {error ? (
        <p>No books found</p>
      ) : data === "Not Found" ? (
        <section className="scanner">
          <h3>Please scan your book's ISBN number</h3>
          <BarcodeScannerComponent
            width={400}
            height={400}
            onUpdate={(err, result) => {
              if (result) {
                setData(result.text);
              }
            }}
          />
        </section>
      ) : (
        <ul>
          {books.map((book) => {
            return (
              <li key={book.id}>
                <p>
                  <strong>Title:</strong> {book.title}
                </p>
                <img
                  src={book.images?.thumbnail}
                  alt={`${book.title}'s cover art`}
                ></img>
                <p>
                  <strong>Author(s):</strong>{" "}
                  {book.authors.map((author) => author)}
                </p>
                <button>Select this book</button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default App;

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
