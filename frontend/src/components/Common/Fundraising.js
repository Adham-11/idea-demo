"use client";
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Fundraise() {
  return (
    <div className="bg-white mx-auto" style={{ maxWidth: "1440px" }}>
      {/* Header Section */}
      <Container fluid className="py-5 px-4">
        <h1 className="mt-5 text-dark fw-bold display-4 text-start ms-3">
          We make it easy to start your project.
        </h1>
      </Container>

      {/* Main Content Section */}
      <Container fluid className="px-4">
        <Row className="mt-5">
          <Col xs={12} md={6} className="mt-4">
            <p className="fs-2 text-dark">
              <span className="fw-bold">Browse</span> hundreds of investment opportunities, connect with investors and manage your investment contacts with the world's investors network.
            </p>
            <div className="mt-5">
              <h3 className="fs-4 fw-bold">Follow Us</h3>
              <div className="d-flex gap-2 mt-3">
                {[
                  "d08d1c7b17113ec12bafd97d86d046d5ba1d3de6",
                  "b5cc48022ac760096a5de64a9a40d75e86140e38",
                  "c48db060c22cbbdbfcda78e79607ef525048b50c",
                  "150c0b317a34eac146955992419d4495b7397420",
                  "e3fa4663eede982f7acd0e9a172c8b1674ac6fb7"
                ].map((id, index) => (
                  <img
                    key={index}
                    src={`https://cdn.builder.io/api/v1/image/assets/b01fe73a9d294126b8ebcdfd94d4804e/${id}?placeholderIfAbsent=true`}
                    className="img-fluid"
                    alt="Social media icon"
                    style={{ width: "50px" }}
                  />
                ))}
              </div>
            </div>
          </Col>
          <Col xs={12} md={6} className="position-relative mt-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/b01fe73a9d294126b8ebcdfd94d4804e/87e77f73034a43f89a19a81b3dbd12e8aa25f50f?placeholderIfAbsent=true"
              className="img-fluid position-absolute w-100 h-100"
              alt="Background pattern"
              style={{ objectFit: "cover" }}
            />
            <div className="bg-dark text-white rounded-4 p-4 mt-5 position-relative" style={{ maxWidth: "500px" }}>
              <Row>
                <Col xs={7}>
                  <div className="d-flex align-items-start">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/b01fe73a9d294126b8ebcdfd94d4804e/9681df83f94dc594a2e0a40495d9952f8487f01e?placeholderIfAbsent=true"
                      className="img-fluid rounded-3 me-3"
                      alt="Investor profile"
                      style={{ width: "80px" }}
                    />
                    <div>
                      <h4 className="fs-3 fw-bold">BOB</h4>
                      <p className="fs-5">Angel Investor</p>
                      <div className="d-flex align-items-center bg-light bg-opacity-75 rounded-3 p-2 mt-2">
                        <span className="fs-5 text-dark me-2">Egypt</span>
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets/b01fe73a9d294126b8ebcdfd94d4804e/da4216f546a517d730c2fa80bc4468a55c53600d?placeholderIfAbsent=true"
                          className="img-fluid"
                          alt="Location icon"
                          style={{ width: "20px" }}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={5} className="text-center">
                  <p className="fs-5">EGP 150,000,000</p>
                  <p className="fs-6">Net Worth</p>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col xs={12} md={7}>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/b01fe73a9d294126b8ebcdfd94d4804e/3666f2aae661ac4f4bd012e653c6279a95f54fb8?placeholderIfAbsent=true"
              className="img-fluid rounded-4 shadow"
              alt="Project showcase"
              style={{ maxWidth: "100%", minHeight: "480px" }}
            />
          </Col>
          <Col xs={12} md={5} className="d-flex align-items-center">
            <div className="text-center">
              <h2 className="fs-1 fw-bold">Find investor for your project</h2>
              <p className="fs-4">
                Access the largest opportunities to reach investors in your field. Filter opportunities by country, location, industry, stage, investment range and language to find the deal for you.
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Mobile App Section */}
      <section className="bg-dark text-white py-5 px-4 mt-5">
        <Container>
          <h2 className="text-center fs-2">
            Seamless Experience: Our Platform Now Also Accessible via Mobile App
          </h2>
          <Row className="mt-5">
            <Col xs={12} md={8}>
              <div className="d-flex align-items-start">
                <div className="me-3">
                  {[
                    "a8434e1f049ddf5e45408a2140c5b4280ab72ea3",
                    "921f5ec1f30981d7eeedc0a1b61953eb9a53796f",
                    "8c076dd4957b8ff287034280c700254eeb5ed216"
                  ].map((id, index) => (
                    <img
                      key={index}
                      src={`https://cdn.builder.io/api/v1/image/assets/b01fe73a9d294126b8ebcdfd94d4804e/${id}?placeholderIfAbsent=true`}
                      className="img-fluid mb-3"
                      alt={`Feature icon ${index + 1}`}
                      style={{ width: "60px" }}
                    />
                  ))}
                </div>
                <div>
                  <p className="fs-4">
                    Search for opportunists through your private interface.<br />
                    Request a meeting to discuss deals with investors.<br />
                    Manage your project grow and your portfolio.
                  </p>
                  <h3 className="fs-4 mt-3">Download the app</h3>
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/b01fe73a9d294126b8ebcdfd94d4804e/20b4ff6e9593b91edd808c2a296609667afc572a?placeholderIfAbsent=true"
                    className="img-fluid mt-3"
                    alt="App store badges"
                    style={{ maxWidth: "300px" }}
                  />
                  <p className="fs-5 mt-2">Available on Android and iOS.</p>
                </div>
              </div>
            </Col>
            <Col xs={12} md={4}>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/b01fe73a9d294126b8ebcdfd94d4804e/88e757e2156092bd9dfdb0d919769ba088523963?placeholderIfAbsent=true"
                className="img-fluid rounded-3"
                alt="Mobile app preview"
                style={{ maxWidth: "100%" }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Scroll to Top Button */}
      <Button
        variant="light"
        className="position-fixed bottom-0 end-0 m-4 shadow"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/b01fe73a9d294126b8ebcdfd94d4804e/e2eea0565481af2cb1df24eb0e680dcde96c1516?placeholderIfAbsent=true"
          alt="Scroll to top"
          style={{ width: "26px" }}
        />
      </Button>

     


    </div>
  );
}

export default Fundraise;