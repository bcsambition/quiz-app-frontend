import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [score, setScore] = useState(0);

  const login = async () => {
    try {
      const res = await axios.post('https://d1e6a0dc-df57-4153-a3cf-c21adae61f96-00-2zdfsm20qt7wz.sisko.replit.dev/login', { email, password });
      setToken(res.data.token);
    } catch (err) {
      console.log(err);
      alert('Invalid credentials');
    }
  };

  const fetchTests = async () => {
    try {
      const res = await axios.get('https://d1e6a0dc-df57-4153-a3cf-c21adae61f96-00-2zdfsm20qt7wz.sisko.replit.dev/tests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTests(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const takeTest = async (testId) => {
    try {
      await axios.post(`https://d1e6a0dc-df57-4153-a3cf-c21adae61f96-00-2zdfsm20qt7wz.sisko.replit.dev/take-test/${testId}`, {
        score
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Test submitted successfully');
    } catch (err) {
      console.log(err);
      alert('Error submitting the test');
    }
  };

  useEffect(() => {
    if (token) fetchTests();
  }, [token]);

  return (
    <div>
      {!token ? (
        <div>
          <h1>Login</h1>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <div>
          <h1>Tests</h1>
          <ul>
            {tests.map(test => (
              <li key={test._id}>
                {test.name} ({test.type})
                <button onClick={() => setSelectedTest(test)}>Take Test</button>
              </li>
            ))}
          </ul>
          {selectedTest && (
            <div>
              <h2>{selectedTest.name}</h2>
              <p>Score: <input type="number" value={score} onChange={e => setScore(e.target.value)} /></p>
              <button onClick={() => takeTest(selectedTest._id)}>Submit Test</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
