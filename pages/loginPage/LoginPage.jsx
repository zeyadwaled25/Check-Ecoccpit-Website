import Footer from "../../components/footer/Footer";
import Form from "../../components/form/Form";
import "./LoginPage.css"

function LoginPage () {

  return (

    <div className="login-page">
      <header className="sign-in">
        <div className="container text-end py-4 px-2">
          <a href="#" className="text-decoration-none">
            Sign in
          </a>
        </div>
      </header>
      <main>
        <Form />
        <section className="notification">
          <div className="container">
            <h5>Notification</h5>
            <div className="notification-content text-center">
              <p className="mb-0">
                You can find and verify the content of the CO issued by CCPIT
                here by input certification NO. and serial No.
              </p>
              <p className="mb-0">
                As a unsubscribe user you can only find the limited content
                such as Exporter、Authorized by、Invoice No.
              </p>
              <p className="mb-0">
                Country、H.S.Code、Issue date.If you want to find the detail
                please Sign in.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>

  );
}

export default LoginPage;