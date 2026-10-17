# introduction to react
react is a javascript library that aims to simplify the devlopment of hight interactive interfaces.<br>
its primary goal is to make it easy to reason about an interface and its state at any point in time, by dividing the ui into a **collection of components**

so i can easly navigate react easly i need to know those concepts of the javascript 
* variables
* function, arraw function
* objects and arrays
* work with objects and arrays using **rest and spread**
* object and array destructing
* template literals
* callbacks
* ES modules

# React component
1. we can declare function and inside a function we can do something like fetch data, or inspect the current state of the application.
then we can return something from the function, and that will be rendered by React on the page.
2. component has some special characteristic : 
    * it must have a name that starts with a capital letter, like App
    * a component can have it own state, wish means that it encapsulate some variables that other component can't access unless this component exposes this state to the rest of the application.
    * it can also receive data from other component, and this case we can talks about **props**

## JSX


```
import React from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardTitle, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn } from 'mdb-react-ui-kit';

export default function Basic() {
  return (
    <div className="vh-100" style={{ backgroundColor: '#9de2ff' }}>
      <MDBContainer>
        <MDBRow className="justify-content-center">
          <MDBCol md="9" lg="7" xl="5" className="mt-5">
            <MDBCard style={{ borderRadius: '15px' }}>
              <MDBCardBody className="p-4">
                <div className="d-flex text-black">
                  <div className="flex-shrink-0">
                    <MDBCardImage
                      style={{ width: '180px', borderRadius: '10px' }}
                      src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp'
                      alt='Generic placeholder image'
                      fluid />
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <MDBCardTitle>Danny McLoan</MDBCardTitle>
                    <MDBCardText>Senior Journalist</MDBCardText>

                    <div className="d-flex justify-content-start rounded-3 p-2 mb-2"
                      style={{ backgroundColor: '#efefef' }}>
                      <div>
                        <p className="small text-muted mb-1">Articles</p>
                        <p className="mb-0">41</p>
                      </div>
                      <div className="px-3">
                        <p className="small text-muted mb-1">Followers</p>
                        <p className="mb-0">976</p>
                      </div>
                      <div>
                        <p className="small text-muted mb-1">Rating</p>
                        <p className="mb-0">8.5</p>
                      </div>
                    </div>
                    <div className="d-flex pt-1">
                      <MDBBtn outline className="me-1 flex-grow-1">Chat</MDBBtn>
                      <MDBBtn className="flex-grow-1">Follow</MDBBtn>
                    </div>
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}


```