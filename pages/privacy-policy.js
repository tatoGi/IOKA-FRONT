import React from "react";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { NAVIGATION_MENU } from "@/routes/apiRoutes";
import SubscribeSection from "@/components/SubscribeSection/SubscribeSection";

const PrivacyPolicy = () => {
  const breadcrumbData = [
    { title: "Home", path: "/" },
    { title: "Privacy Policy", path: "/privacy-policy" }
  ];

  return (
    <>
      <Breadcrumb breadcrumbData={breadcrumbData} />
      <div className="container">
        <div className="privacy-policy-content">
          <h1>Privacy Policy</h1>

          <div className="content-section">
            <h2>Cookies Policy</h2>
            <p>
              We at Unique Properties Broker are committed to protecting your
              privacy. This Privacy Policy applies to our Website{" "}
              <a
                href="https://www.uniqueproperties.ae/en/"
                target="_blank"
                rel="noopener noreferrer"
              >
                (https://www.uniqueproperties.ae/en/)
              </a>
              . This Privacy Policy governs our data collection, processing and
              usage practices. It also describes your choices regarding use,
              access and correction of your personal information. If you do not
              agree with the data practices described in this Privacy Policy,
              you should not use the Websites or the Subscription Service.
            </p>
            <p>
              We periodically update this Privacy Policy. We will post any
              privacy policy changes on this page and, if the changes are
              significant, we will provide a more prominent notice by sending
              you an email notification. While we will notify you of any
              material changes to this Privacy Policy, we encourage you to
              review this Privacy Policy periodically. We will also keep prior
              versions of this Privacy Policy in an archive for your review. If
              you have any questions about this Privacy Policy or our treatment
              of the information you provide us, please write to us by email at{" "}
              <a href="mailto:privacy@uniqueproperties.ae">
                privacy@uniqueproperties.ae
              </a>{" "}
              or by mail toThe Bay Gate Tower, 31st Floor, Business Bay, Dubai,
              Attn: Privacy.
            </p>
            <ol className="privacy-list">
              <li>Information We Collect</li>
              <li>How We Use Information We Collect</li>
              <li>How we Share Information we Collect</li>
              <li>International Transfer of Information</li>
              <li>Cookies and Similar Technologies</li>
              <li>How to Access & Control Your Personal Data</li>
            </ol>
          </div>

          <div className="content-section">
            <h2>1. Information We Collect</h2>
            <h3>When You Visit our Websites</h3>
            <p>
              You are free to explore the Websites without providing any
              Personal Information about yourself. When you visit the Websites
              or register for more information, we request that you provide
              Personal Information about yourself, and we collect Navigational
              Information.
            </p>
            <h3>"Personal Information"</h3>
            <p>
              This refers to any information that you voluntarily submit to us
              and that identifies you personally, including contact information,
              such as your name, e-mail address, company name, address, phone
              number, and other information about yourself or your business.
              Personal Information can also include information that you enter
              into Websites and information about you that is available on the
              internet, such as from Facebook, LinkedIn, Twitter and Google, or
              publicly available information that we acquire from service
              providers.
            </p>
            <p>
              Personal Information also includes Navigational Information.
              Navigational Information refers to information about your computer
              and your visits to this website such as your IP address,
              geographical location, browser type, referral source, length of
              visit and pages viewed. Please see the "Navigation Information"
              section below.
            </p>
            <h3>Log Files</h3>
            <p>
              When view content provided by us, we automatically collect
              information about your computer hardware and software. This
              information can include your IP address, browser type, domain
              names, internet service provider (ISP), the files viewed on our
              site (e.g., HTML pages, graphics, etc.), operating system,
              clickstream data, access times and referring website addresses.
              This information is used by Unique Properties Broker for the
              operation of the service, to maintain quality of the service, and
              to provide general statistics regarding use of the Unique
              Properties Broker Website. For these purposes, we do link this
              automatically-collected data to Personal Information such as name,
              email address, address, and phone number.
            </p>
            <h3>Information we collect from third parties</h3>
            <p>
              From time to time, we may receive Personal Information about you
              from third party sources including partners with which we offer
              co-branded services or engage in joint marketing activities, and
              publicly available sources such as social media websites.
            </p>
            <h3>Information About Children</h3>
            <p>
              The Websites are not intended for or targeted at children under
              16, and we do not knowingly or intentionally collect information
              about children under 16. If you believe that we have collected
              information about a child under 16, please contact us at{" "}
              <a href="mailto:privacy@uniqueproperties.ae">
                privacy@uniqueproperties.ae
              </a>{" "}
              so that we may delete the information.
            </p>
          </div>

          <div className="content-section">
            <h2>2. How we use information we collect:</h2>

            <h3>Compliance with Our Privacy Policy</h3>
            <p>
              We use the information we collect only in compliance with this
              Privacy Policy. Users who subscribe to our Services are obligated
              through our agreements with them to comply with this Privacy
              Policy.
            </p>

            <h3>We Never Sell Personal Information</h3>
            <p>
              We will never sell your Personal Information to any third party.
            </p>

            <h3>Use of Personal Information</h3>
            <p>
              In addition to the uses identified elsewhere in this Privacy
              Policy, we may use your Personal Information to:
            </p>
            <ul className="bullet-list">
              <li>
                Improve your browsing experience by personalizing the Websites
                and to improve the Subscription Service;
              </li>
              <li>
                Send information or Unique Properties Broker communications to
                you which we think may be of interest to you by post, email, or
                other means and send you marketing communications relating to
                our business;
              </li>
              <li>
                Promote use of our services to you and share promotional and
                information content with you in accordance with your
                communication preferences;
              </li>
              <li>
                Provide other companies with statistical information about our
                users -- but this information will not be used to identify any
                individual user;
              </li>
              <li>
                Send information to you regarding changes to our Customer Terms
                of Service, Privacy Policy (including the Cookie Policy), or
                other legal agreements
              </li>
              <li>Meet legal requirements.</li>
            </ul>
            <p>
              We may, from time to time, contact you on behalf of external
              business partners about a particular offering that may be of
              interest to you. In those cases, we do not transfer your Personal
              Information to the third party.
            </p>
            <p>
              We use the information collected through our website by our users
              for the following purposes:
            </p>
            <ul className="bullet-list">
              <li>To respond to customer support requests; and</li>
              <li>
                Otherwise to fulfil the obligations under the Unique Properties
                Broker Terms of Service.
              </li>
            </ul>

            <h3>
              Legal basis for processing Personal Information (EEA visitors
              only)
            </h3>
            <p>
              If you are a visitor/customer located in the European Economic
              Area ("EEA"), Unique Properties Broker is the data controller of
              your personal information. Unique Properties Broker's Data
              Protection Officer can be contacted at{" "}
              <a href="mailto:privacy@uniqueproperties.ae">
                privacy@uniqueproperties.ae
              </a>
              .
            </p>
            <p>
              Our legal basis for collecting and using the personal information
              described above will depend on the personal information concerned
              and the specific context in which we collect it. However, we will
              normally collect personal information from you only where we have
              your consent to do so, where we need the personal information to
              perform a contract with you, or where the processing is in our
              legitimate interests and not overridden by your data protection
              interests or fundamental rights and freedoms. In some cases, we
              may also have a legal obligation to collect personal information
              from you.
            </p>
            <p>
              If we ask you to provide personal information to comply with a
              legal requirement or to perform a contract with you, we will make
              this clear at the relevant time and advise you whether the
              provision of your personal information is mandatory or not (as
              well as of the possible consequences if you do not provide your
              personal information). Similarly, if we collect and use your
              personal information in reliance on our legitimate interests (or
              those of any third party), we will make clear to you at the
              relevant time what those legitimate interests are.
            </p>

            <h3>Use of Navigational Information</h3>
            <p>
              We use Navigational Information to operate and improve the
              Websites and the Subscription Service. We may also use
              Navigational Information alone or in combination with Personal
              Information to provide you with personalized information about
              Unique Properties Broker.
            </p>

            <h3>Customer Testimonials and Comments</h3>
            <p>
              We post customer testimonials and comments on our Websites, which
              may contain Personal Information. We obtain each customer's
              consent via email prior to posting the customer's name and
              testimonial.
            </p>

            <h3>Security of your Personal Information</h3>
            <p>
              We use a variety of security technologies and procedures to help
              protect your Personal Information from unauthorized access, use or
              disclosure. We secure the Personal Information you provide on
              computer servers in a controlled, secure environment, protected
              from unauthorized access, use or disclosure. All Personal
              Information is protected using appropriate physical, technical and
              organizational measures.
            </p>

            <h3>Social Media Features</h3>
            <p>
              Our Websites include Social Media Features, such as the Facebook
              Like button and Widgets, such as the Share This button or
              interactive mini-programs that run on our sites. These features
              may collect your IP address, which page you are visiting on our
              sites, and may set a cookie to enable the feature to function
              properly. Social Media Features and Widgets are either hosted by a
              third party or hosted directly on our Websites. This Privacy
              Policy does not apply to these features. Your interactions with
              these features are governed by the privacy policy and other
              policies of the companies providing them.
            </p>

            <h3>External Websites</h3>
            <p>
              Our Websites provide links to other websites. We do not control,
              and are not responsible for, the content or practices of these
              other websites. Our provision of such links does not constitute
              our endorsement of these other websites, their content, their
              owners, or their practices. This Privacy Policy does not apply to
              these other websites, which are subject to any privacy and other
              policies they may have.
            </p>

            <h3>Public Forums</h3>
            <p>
              We offer publicly accessible message boards, blogs, and community
              forums. Please keep in mind that if you directly disclose any
              information through our public message boards, blogs, or forums,
              this information may be collected and used by others. We will
              correct or delete any information you have posted on the Websites
              if you so request, as described in "Opting Out and Unsubscribing"
              below.
            </p>

            <h3>Retention of Personal Information</h3>
            <p>
              How long we keep information we collect about you depends on the
              type of information, as described in further detail below. After
              such time, we will either delete or anonymize your information or,
              if this is not possible, then we will securely store your
              information and isolate it from any further use until deletion is
              possible.
            </p>
            <p>
              We retain Personal Information that you provide to us where we
              have an ongoing legitimate business need to do so (for example, as
              long as is required in order to contact you about the Subscription
              Service or our other services, or as needed to comply with our
              legal obligations, resolve disputes and enforce our agreements).
            </p>
            <p>
              When we have no ongoing legitimate business need to process your
              Personal Information, we securely delete the information or
              anonymise it or, if this is not possible, then we will securely
              store your Personal Information and isolate it from any further
              processing until deletion is possible. We will delete this
              information from the servers at an earlier date if you so request,
              as described in "To Unsubscribe from Our Communications" below.
            </p>
            <p>
              If you provide information to our customers as part of their use
              of the Subscription Service, our customers decide how long to
              retain the personal information they collect from you. If a
              customer terminates its use of the Subscription Service, then we
              will provide customer with access to all information stored for
              the customer by the Subscription Service, including any Personal
              Information provided by you, for export by the customer according
              to our agreement with our customer. After termination, we may,
              unless legally prohibited, delete all customer information,
              including your Personal Information, from the Subscription
              Service.
            </p>
            <p>
              If you have elected to receive marketing communications from us,
              we retain information about your marketing preferences for a
              reasonable period of time from the date you last expressed
              interest in our content, products, or services, such as when you
              last opened an email from us or ceased using your Unique
              Properties Broker account. We retain information derived from
              cookies and other tracking technologies for a reasonable period of
              time from the date such information was created.
            </p>
          </div>

          <div className="content-section">
            <h2>3. How we share information we collect</h2>
            
            <h3>Retention of Personal Information</h3>
            <p>
              We employ other companies and people to provide services to visitors to our Websites...
            </p>
          </div>

          <div className="content-section">
            <h2>4. International transfer of Information:</h2>

            <h3>
              International Transfers within Unique Properties Broker&apos;s
              Entities
            </h3>
            <p>
              To facilitate our global operations, we transfer information to
              our offices in the Kingdom of Saudia Arabia and allow access to
              that information from there in which Unique Properties Broker
              affiliated entities have operations for the purposes described in
              this policy.
            </p>
            <p>
              This Privacy Policy shall apply even if we transfer Personal
              Information to other countries. We have taken appropriate
              safeguards to require that your Personal Information will remain
              protected. When we share information about you within and among
              Unique Properties Broker&apos;s affiliated entities, we make use
              of standard contractual data protection clauses, which have been
              approved by the European Commission, and we rely on the EU-U.S.
              and Swiss-U.S. Privacy Shield Framework to safeguard the transfer
              of information we collect from the European Economic Area and
              Switzerland. Please see our Privacy Shield notice below for more
              information.
            </p>

            <h3>International transfers to third parties</h3>
            <p>
              Some of the third parties described in this privacy policy, which
              provide services to us under contract, are based in other
              countries that may not have equivalent privacy and data protection
              laws to the country in which you reside. When we share information
              of customers in the European Economic Area or Switzerland, we make
              use of the EU-U.S. and Swiss-U.S. Privacy Shield Frameworks,
              European Commission-approved standard contractual data protection
              clauses, binding corporate rules for transfers to data processors,
              or other appropriate legal mechanisms to safeguard the transfer.
              Please see our Privacy Shield Notice below.
            </p>

            <h3>Privacy Shield Notice</h3>
            <p>
              Unique Properties Broker participates in and has certified its
              compliance with the EU-U.S. Privacy Shield Framework and the
              Swiss-U.S. Privacy Shield Framework. The following affiliated
              entities adhere to the Privacy Shield principles: Unique
              Properties Broker. Unique Properties is committed to subjecting
              all personal data received from European Union (EU) member
              countries and Switzerland, in reliance on the Privacy Shield
              Framework, to the Framework&apos;s applicable Principles. To learn
              more about the Privacy Shield Framework, visit the Privacy Shield
              list at{" "}
              <a
                href="https://www.privacyshield.gov"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.privacyshield.gov
              </a>
              .
            </p>
            <p>
              If you have an unresolved privacy or data use concern that we have
              not addressed satisfactorily you may direct any inquiries or
              complaints related to our Privacy Shield compliance to{" "}
              <a href="mailto:privacy@uniqueproperties.ae">
                privacy@uniqueproperties.ae
              </a>
              .
            </p>
            <p>
              Under certain conditions, more fully described on the Privacy
              Shield website, you may be entitled to invoke binding arbitration
              when other dispute resolution procedures have been exhausted.
            </p>
        </div>

          <div className="content-section">
            <h2>5. Cookies & similar technologies</h2>

            <h3>Cookies</h3>
            <p>
              Unique Properties Broker and its partners use cookies or similar
              technologies (such as web beacons) to analyze trends, administer
              the website, track users' movements around the website, and to
              gather demographic information about our user base as a whole. To
              find out more about how we use cookies on our Websites and how to
              manage your cookie preferences please see our Cookie Policy.
            </p>

            <h3>Navigational Information Collected by Our Customers</h3>
            <p>
              Our customers can use the tools we provide, as well as tools
              provided by third parties, to collect Navigational Information
              when you visit their webpages on the Subscription Service. Unique
              Properties Broker does not control our customers' use of these
              tools, nor do we control the information they collect or how they
              use it.
            </p>

            <h3>Flash Cookies and Other Third Party Tracking Technologies</h3>
            <p>
              The Adobe Flash Player (and similar applications) use technology
              to remember settings, preferences and usage similar to browser
              cookies but these are managed through a different interface than
              the one provided by your Web browser. This technology creates
              locally stored objects that are often referred to as "Flash
              cookies." Unique Properties Broker does not use Flash cookies.
              However, our customers of our software platform may create pages
              on the Unique Properties Broker platform that employ Adobe Flash
              cookies. For more information on "Flash cookies" and how you can
              manage them please visit our Cookie Policy.
            </p>

            <h3>Advertising</h3>
            <p>
              We partner with a third party ad network to either display
              advertising on our Web site or to manage our advertising on other
              sites. Our ad network partner uses cookies and Web beacons to
              collect information about your activities on this and other Web
              sites to provide you targeted advertising based upon your
              interests. If you wish to not have this information used for the
              purpose of serving you targeted ads, you may opt-out by clicking
              here: http://preferences.truste.com/ (or if located in the
              European Union, by clicking here:
              http://www.youronlinechoices.eu/). Please note this does not opt
              you out of being served advertising. You will continue to receive
              generic ads.
            </p>

            <h3>Third Party Tracking Technologies</h3>
            <p>
              The use of cookies and web beacons by any tracking utility company
              is not covered by our Privacy Policy or Cookie Policy.
            </p>
          </div>

          <div className="content-section">
            <h2>6. How to access & control your personal data:</h2>

            <h3>
              Reviewing, Correcting and Removing Your Personal Information
            </h3>
            <p>You have the following data protection rights:</p>
            <ul className="bullet-list">
              <li>
                You can request access, correction, updates or deletion of your
                personal information.
              </li>
              <li>
                You can object to processing of your personal information, ask
                us to restrict processing of your personal information or
                request portability of your personal information.
              </li>
              <li>
                If we have collected and process your personal information with
                your consent, then you can withdraw your consent at any time.
                Withdrawing your consent will not affect the lawfulness of any
                processing we conducted prior to your withdrawal, nor will it
                affect processing of your personal information conducted in
                reliance on lawful processing grounds other than consent.
              </li>
              <li>
                You have the right to complain to a data protection authority
                about our collection and use of your personal information.
                Contact details for data protection authorities in the EEA,
                Switzerland and certain non-European countries (including the US
                and Canada) are available <a href="#">here</a>.
              </li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at{" "}
              <a href="mailto:privacy@uniqueproperties.ae">
                privacy@uniqueproperties.ae
              </a>{" "}
              or by mail to Unique Properties The Bay Gate Tower, 31st Floor,
              Business Bay, Dubai, United Arab Emirates.
            </p>
            <p>Attention: Privacy</p>
            <p>
              We will respond to your request to change, correct, or delete your
              information within a reasonable timeframe and notify you of the
              action we have taken.
            </p>

            <h3>Anti-Spam Policy</h3>
            <p>
              Our Acceptable Use Policy applies to us and to our customers and,
              among other things, prohibits use of the Subscription Service to
              send unsolicited commercial email in violation of applicable laws,
              and requires the inclusion in every email sent using the
              Subscription Service of an "opt-out" mechanism and other required
              information. We require all of our customers to agree to adhere to
              the Acceptable Use Policy at all times, and any violations of the
              Acceptable Use Policy by a customer can result in immediate
              suspension or termination of the Subscription Service.
            </p>

            <h3>To Unsubscribe From Our Communications</h3>
            <p>
              You may unsubscribe from our marketing communications by clicking
              on the "unsubscribe" link located on the bottom of our e-mails,
              updating your communication preferences, or by sending us email us
              at{" "}
              <a href="mailto:privacy@uniqueproperties.ae">
                privacy@uniqueproperties.ae
              </a>{" "}
              or postal mail to Unique Properties Broker, Business Bay, Dubai,
              United Arab Emirates, Attention: Privacy. Customers cannot opt out
              of receiving transactional emails related to their account with
              us.
            </p>

            <h3>To Unsubscribe from Our Users' Communications</h3>
            <p>
              Our users are solely responsible for their own marketing emails
              and other communications; we cannot unsubscribe you from their
              communications. You can unsubscribe from our users' marketing
              communications by clicking on the "unsubscribe" link located on
              the bottom of their emails, or by contacting them directly.
            </p>

            <h3>Contact</h3>
            <p>Unique Properties Broker.</p>
            <p>
              Unique Properties Real Estate Broker is a company registered in
              Dubai, United Arab Emirates ( License No. 605653), The Bay Gate
              Tower, 31st Floor, Business Bay, Dubai, PO Box 191630 We are
              regulated by the Real Estate Regulatory Agency under office number
              1085.
            </p>
          </div>
        </div>
        <SubscribeSection />
      </div>
    </>
  );
};
export default PrivacyPolicy;
