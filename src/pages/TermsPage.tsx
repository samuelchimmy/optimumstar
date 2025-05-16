
import Layout from '../components/Layout';

export default function TermsPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
        
        <div className="prose prose-slate max-w-none">
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Disclaimer</h2>
            <p className="mb-4">
              OptimumStar is a community contribution created by "jadeofwallstreet" and is <strong>NOT</strong> an official 
              Optimum production. This application is created for educational and entertainment purposes only.
            </p>
            <p className="mb-4">
              The use of the Optimum name and logo is for amusement and educational purposes only, not for commercial use. 
              This project is not affiliated with, endorsed by, or connected to Optimum Network or any of its subsidiaries or affiliates.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">About Optimum</h2>
            <p className="mb-4">
              Optimum is a high-performance memory infrastructure for any blockchain, powered by RLNC technology to
              improve speed, scalability, and throughput across decentralized applications.
            </p>
            <p className="mb-4">
              This quiz app aims to help users learn about Optimum's technology and its benefits for the Web3 ecosystem in a fun
              and engaging way.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">No Liability</h2>
            <p className="mb-4">
              The creator of this application, "jadeofwallstreet", shall not be held liable for any damages, losses, or 
              consequences that may arise from the use or misuse of this application. Users access and use this application 
              entirely at their own risk.
            </p>
            <p className="mb-4">
              The information provided in this quiz application is for general informational purposes only. While we strive 
              to provide accurate information, we make no representations or warranties of any kind, express or implied, 
              about the completeness, accuracy, reliability, suitability, or availability of the information contained within this application.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Intellectual Property</h2>
            <p className="mb-4">
              All intellectual property rights related to Optimum belong to their respective owners. The use of the Optimum 
              name and logo in this application is not intended to infringe upon any trademark, copyright, or other intellectual 
              property rights.
            </p>
            <p className="mb-4">
              If you are the rights holder of any content used in this application and believe that your rights have been 
              infringed upon, please contact us immediately so that we can address your concerns.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">User Conduct</h2>
            <p className="mb-4">
              Users of this application agree to use it only for lawful purposes and in a way that does not infringe upon 
              the rights of others or restrict or inhibit anyone else's use and enjoyment of the application.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms and conditions at any time without prior notice. Your continued 
              use of the application after any modifications indicates your acceptance of the modified terms.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p>
              If you have any questions or concerns about these Terms & Conditions, please contact "jadeofwallstreet" via 
              <a href="https://x.com/MetisCharter" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary transition-colors ml-1">
                Twitter/X
              </a>.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
