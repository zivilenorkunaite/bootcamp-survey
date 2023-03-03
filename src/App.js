import React, { useState } from "react";
import "./survey.css";
import { v4 as uuidv4 } from "uuid";
import "./utils/aws";
// import  uploadFileToS3  from './utils/aws';

import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBRadio,
  MDBRow,
  MDBTextArea,
} from "mdb-react-ui-kit";
import { MDBInput } from "mdb-react-ui-kit";

import AWS from "aws-sdk";

const accessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY;
const secretAccessKey = process.env.REACT_APP_AWS_SECRET_KEY;
const region = process.env.REACT_APP_AWS_REGION;
const bucketName = process.env.REACT_APP_S3_BUCKET_NAME;

const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
  region,
});

const uploadFileToS3 = (filename, data) => {
  const params = {
    Bucket: bucketName,
    Key: filename,
    Body: data,
    ContentType: "application/json",
  };

  return s3.upload(params).promise();
};

function App() {
  const [firstName, setFirstName] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [experience, setExperience] = useState("");
  const [feedback, setFeedback] = useState("");
  const [currentRoleOther, setCurrentRoleOther] = useState("");
  const [companyName, setcompanyName] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [surveyComplete, setSurveyComplete] = useState(false);
  const [error, setError] = useState(false);

  const [erroMessage, setErrorMessage] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);

    const fileName = uuidv4() + ".json";

    const surveyData = {
      firstName: firstName,
      companyName: companyName,
      currentRole: currentRole === "Other" ? currentRoleOther : currentRole,
      feedback: feedback,
      experience: experience,
    };

    try {
      await uploadFileToS3(fileName, JSON.stringify(surveyData));
      console.log(JSON.stringify(surveyData));
      setSurveyComplete(true);
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      setError(true);
      setErrorMessage("Response could not be uploaded to destination");
    }
  };

  return (
    <MDBContainer>
      <MDBRow className="justify-content-center">
        <MDBCol size="10">
          <MDBCard>
            <MDBCardBody>
              <div className="text-center">
                <p>
                  <strong> Lakehouse Bootcamp Survey</strong>
                </p>
              </div>

              <hr />

              <div className="survey-container">
                {surveyComplete ? (
                  <div className="text-center">
                    <p>
                      <strong> Thank you for completing the survey!</strong>
                    </p>
                  </div>
                ) : submitting ? (
                  <div className="text-center">
                    <p>
                      <strong> Submitting ... </strong>
                    </p>
                  </div>
                ) : error ? (
                  <div className="text-center">
                    <p>
                      <h2> Error occured while submitting this form</h2>
                      <strong> {erroMessage} </strong>
                    </p>
                  </div>
                ) : (
                  <form className="px-8" onSubmit={handleSubmit}>
                    <div>
                      <p className="text-center">
                        <strong>First Name</strong>
                      </p>
                      <MDBInput
                        label="First Name"
                        id="firstName"
                        name="firstName"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        required
                        type="text"
                      />
                    </div>
                    <br />
                    <div>
                      <p className="text-center">
                        <strong>What company do you work at?</strong>
                      </p>

                      <MDBInput
                        label="Company Name"
                        type="text"
                        className="survey-input"
                        id="companyName"
                        name="companyName"
                        value={companyName}
                        onChange={(event) => setcompanyName(event.target.value)}
                        required
                      />
                    </div>
                    <br />
                    <div>
                      <p className="text-center">
                        <strong>What is your current role?</strong>
                      </p>

                      <select
                        id="currentRole"
                        name="currentRole"
                        className="survey-select"
                        value={currentRole}
                        onChange={(event) => setCurrentRole(event.target.value)}
                        required
                      >
                        <option value="">-- Select --</option>
                        <option value="Data Scientist">Data Engineer</option>
                        <option value="Data Scientist">Data Scientist</option>
                        <option value="Data Analyst">Data Analyst</option>
                        <option value="Software Engineer">
                          Software Engineer
                        </option>
                        <option value="Data Scientist">Student</option>
                        <option value="Data Scientist">Manager</option>

                        <option value="Other">Other</option>
                      </select>
                      {currentRole === "Other" && (
                        <MDBInput
                          label="Enter your role"
                          type="text"
                          id="currentRoleOther"
                          name="currentRoleOther"
                          value={currentRoleOther}
                          onChange={(event) =>
                            setCurrentRoleOther(event.target.value)
                          }
                          required
                        />
                      )}
                    </div>
                    <br />
                    <p className="text-center">
                      <strong>
                        How would you rate your experience with data platforms?:
                      </strong>
                    </p>
                    <MDBRadio
                      id="experience1"
                      name="experience"
                      value="Excellent"
                      onChange={(e) => setExperience(e.target.value)}
                      required
                      label="Excellent"
                    />

                    <MDBRadio
                      id="experience1"
                      name="experience"
                      value="Good"
                      onChange={(e) => setExperience(e.target.value)}
                      required
                      label="Good"
                    />

                    <MDBRadio
                      id="experience1"
                      name="experience"
                      value="Fair"
                      onChange={(e) => setExperience(e.target.value)}
                      required
                      label="Fair"
                    />

                    <MDBRadio
                      id="experience1"
                      name="experience"
                      value="None"
                      onChange={(e) => setExperience(e.target.value)}
                      required
                      label="None"
                    />
                    <br />
                    <p className="text-center">
                      <strong>
                        How satisfied are you with the data platform(s) you
                        currently use? What are main pain points and what do you
                        like about it? Be descriptive
                      </strong>
                    </p>

                    <MDBTextArea
                      label="Enter your feedback"
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={4}
                      required
                    />
                    <br />
                    <br />
                    <MDBBtn type="submit" className="survey-submit">
                      Submit
                    </MDBBtn>
                  </form>
                )}
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default App;
