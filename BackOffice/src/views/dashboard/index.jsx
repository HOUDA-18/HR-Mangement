import React ,{ useEffect, useState } from 'react';
import '/src/index.scss';
import axios from 'axios';


// react-bootstrap
import { Row, Col, Card, Table, ListGroup,Form, Button } from 'react-bootstrap';
// third party
import Chart from 'react-apexcharts';
import PerfectScrollbar from 'react-perfect-scrollbar';

// project import
import OrderCard from '../../components/Widgets/Statistic/OrderCard';
import SocialCard from '../../components/Widgets/Statistic/SocialCard';

import uniqueVisitorChart from './chart/analytics-unique-visitor-chart';
import customerChart from './chart/analytics-cuatomer-chart';
import customerChart1 from './chart/analytics-cuatomer-chart-1';

// assets
import avatar1 from '../../assets/images/user/avatar-1.jpg';
import imgGrid1 from '../../assets/images/gallery-grid/img-grd-gal-1.jpg';
import imgGrid2 from '../../assets/images/gallery-grid/img-grd-gal-2.jpg';
import imgGrid3 from '../../assets/images/gallery-grid/img-grd-gal-3.jpg';

// ==============================|| DASHBOARD ANALYTICS ||============================== //

const DashAnalytics = () => {
  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState('');  
  
  const [sortOrder, setSortOrder] = useState('asc');
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8070/api/users'); 
      setUsers(response.data);
      console.log(response.data)
      setShowUsers(!showUsers); 
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  useEffect(()=>{

    fetchUsers(); 
  },[])
 
   // Sorting handler
   const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Filter and sort users
  const filteredUsers = users
    .filter(user =>
      Object.values(user).some(value =>
        value.toString().toLowerCase().includes(filterText.toLowerCase())
      )
    )
    .sort((a, b) => {
      const modifier = sortOrder === 'asc' ? 1 : -1;
      if (a[sortBy] < b[sortBy]) return -1 * modifier;
      if (a[sortBy] > b[sortBy]) return 1 * modifier;
      return 0;
    });

  return (
    <React.Fragment>
      <Row>
        {/* order cards */}
        <Col md={6} xl={3}>
        <div onClick={fetchUsers} style={{ cursor: 'pointer' }}>
          <OrderCard
            params={{
              title: 'Total Employees',
              class: 'bg-c-blue',
              icon: 'feather icon-users',
              primaryText: '',
              secondaryText: '',
              extraText: ''
            }}
          />
          </div>
        </Col>
         {/* Tableau des utilisateurs */}

        <Col md={6} xl={3}>
          <OrderCard
            params={{
              title: 'Active Offers',
              class: 'bg-c-green',
              icon: 'feather icon-tag',
              primaryText: '',
              secondaryText: '',
              extraText: ''
            }}
          />
        </Col>
        <Col md={6} xl={3}>
          <OrderCard
            params={{
              title: 'Departements',
              class: 'bg-c-yellow',
              icon: 'feather icon-server',
              primaryText: '',
              secondaryText: '',
              extraText: ''
            }}
          />
        </Col>
        <Col md={6} xl={3}>
          <OrderCard
            params={{
              title: 'Attendance',
              class: 'bg-c-red',
              icon: 'feather icon-check-circle',
              primaryText: '',
              secondaryText: '',
              extraText: ''
            }}
          />
        </Col>
        {showUsers && (
  <Col sm={12}>
   <Card className="mt-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Header className="py-4 text-center border-bottom-0 position-relative">
  <Card.Title 
    as="h2" 
    className="mb-0 position-relative d-inline-block"
    style={{
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
      letterSpacing: '-0.03em',
      color: '#2d3748',
      padding: '0 2rem'
    }}
  >
    <div className="title-decoration"></div>
    <span className="position-relative">
      <i className="feather icon-users me-2"></i>List of Users</span>
  </Card.Title>
</Card.Header>
                <div className="d-flex gap-3">
                  <Form.Control
                    type="text"
                    placeholder="Search users..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    style={{ width: '250px' }}
                  />
                  <Form.Select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ width: '200px' }}
                  >
                    <option value="firstname">Sort by FirstName</option>
                    <option value="lastname">Sort by LastName</option>
                    <option value="mail">Sort by Mail</option>
                    <option value="role">Sort by Role</option>
                    <option value="statut">Sort by Statut</option>
                  </Form.Select>
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'asc' ? '↓ Descending' : '↑ Ascending'}
                  </Button>
                </div>
              </Card.Header>

              <Card.Body>
                <PerfectScrollbar>
                  <Table responsive hover className="custom-status-table">
                    <thead className="bg-light">
                      <tr>
                        {['firstname','lastname', 'mail', 'role', 'statut'].map((column) => (
                          <th 
                            key={column}
                            className={sortBy === column ? 'active-sort' : ''}
                            onClick={() => handleSort(column)}
                            style={{ cursor: 'pointer', minWidth: '150px' }}
                          >
                            {column.charAt(0).toUpperCase() + column.slice(1)}
                            {sortBy === column && (
                              <span className="ms-2">
                                {sortOrder === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, index) => (
                        <tr key={index}>
                          <td className="align-middle">{user.firstname}</td>
                          <td className="align-middle">{user.lastname}</td>
                          <td className="align-middle">{user.email}</td>
                          <td className="align-middle text-capitalize">{user.role}</td>
                          <td className="align-middle">
  <div 
  
    className= {`status-indicator ${
      user.active ? 'active' : 'inactive'
    }`}

    style={{
      display: 'inline-block',
     
      width: '90px',
      padding: '8px 12px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: 600, // Augmentation du poids de la police
      transition: 'all 0.3s ease',
      backgroundColor: user.active
        ? 'rgba(40, 167, 69, 0.15)' 
        : 'rgba(220, 53, 69, 0.1)', // Rouge plus visible pour inactive
      color: user.active
        ? '#28a745' 
        : '#dc3545', // Couleur rouge pour inactive
      border: `2px solid ${
        user.active  ? '#28a745' : 'rgba(220, 53, 69, 0.3)'
      }`,
      boxShadow: user.active
        ? '0 2px 12px rgba(40, 167, 69, 0.25)' 
        : '0 2px 8px rgba(220, 53, 69, 0.15)',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <span 
      className="status-glow"
      style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: user.active 
          ? 'radial-gradient(circle, rgba(40,167,69,0.15) 0%, transparent 60%)' 
          : 'radial-gradient(circle, rgba(220,53,69,0.1) 0%, transparent 60%)',
        pointerEvents: 'none'
      }}
    />
    <span 
      className="status-dot"
      style={{
        display: 'inline-block',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        marginRight: '8px',
        backgroundColor: user.active 
          ? '#28a745' 
          : '#dc3545', // Rouge vif pour inactive
        boxShadow: user.active 
          ? '0 0 8px rgba(40, 167, 69, 0.4)' 
          : '0 0 6px rgba(220, 53, 69, 0.3)',
        transform: 'translateZ(0)',
        position: 'relative'
      }}
    />
    {user.active ? 'Active' : 'Inactive'}
  </div>
</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </PerfectScrollbar>
      </Card.Body>
    </Card>
  </Col>
)}

        <Col md={12} xl={6}>
          <Card>
            <Card.Header>
              <h5>Unique Visitor</h5>
            </Card.Header>
            <Card.Body className="ps-4 pt-4 pb-0">
              <Chart {...uniqueVisitorChart} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={12} xl={6}>
          <Row>
            <Col sm={6}>
              <Card>
                <Card.Body>
                  <Row>
                    <Col sm="auto">
                      <span>Customers</span>
                    </Col>
                    <Col className="text-end">
                      <h2 className="mb-0">826</h2>
                      <span className="text-c-green">
                        8.2%
                        <i className="feather icon-trending-up ms-1" />
                      </span>
                    </Col>
                  </Row>
                  <Chart {...customerChart} />
                  <Row className="mt-3 text-center">
                    <Col>
                      <h3 className="m-0">
                        <i className="fas fa-circle f-10 mx-2 text-success" />
                        674
                      </h3>
                      <span className="ms-3">New</span>
                    </Col>
                    <Col>
                      <h3 className="m-0">
                        <i className="fas fa-circle text-primary f-10 mx-2" />
                        182
                      </h3>
                      <span className="ms-3">Return</span>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={6}>
              <Card className="bg-primary text-white">
                <Card.Body>
                  <Row>
                    <Col sm="auto">
                      <span>Customers</span>
                    </Col>
                    <Col className="text-end">
                      <h2 className="mb-0 text-white">826</h2>
                      <span className="text-white">
                        8.2%
                        <i className="feather icon-trending-up ms-1" />
                      </span>
                    </Col>
                  </Row>
                  <Chart {...customerChart1} />
                  <Row className="mt-3 text-center">
                    <Col>
                      <h3 className="m-0 text-white">
                        <i className="fas fa-circle f-10 mx-2 text-success" />
                        674
                      </h3>
                      <span className="ms-3">New</span>
                    </Col>
                    <Col>
                      <h3 className="m-0 text-white">
                        <i className="fas fa-circle f-10 mx-2 text-white" />
                        182
                      </h3>
                      <span className="ms-3">Return</span>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col lg={4} md={12}>
          <SocialCard
            params={{
              icon: 'fa fa-envelope-open',
              class: 'blue',
              variant: 'primary',
              primaryTitle: '8.62k',
              primaryText: 'Subscribers',
              secondaryText: 'Your main list is growing',
              label: 'Manage List'
            }}
          />
          <SocialCard
            params={{
              icon: 'fab fa-twitter',
              class: 'green',
              variant: 'success',
              primaryTitle: '+40',
              primaryText: 'Followers',
              secondaryText: 'Your main list is growing',
              label: 'Check them out'
            }}
          />
        </Col>
        <Col lg={8} md={12}>
          <Card>
            <Card.Header>
              <h5>Activity Feed</h5>
            </Card.Header>
            <Card.Body className="card-body pt-4">
              <ListGroup as="ul" bsPrefix=" " className="feed-blog ps-0">
                <ListGroup.Item as="li" bsPrefix=" " className="active-feed">
                  <div className="feed-user-img">
                    <img src={avatar1} className="img-radius " alt="User-Profile" />
                  </div>
                  <h6>
                    <span className="badge bg-danger">File</span> Eddie uploaded new files:{' '}
                    <small className="text-muted">2 hours ago</small>
                  </h6>
                  <p className="m-b-15 m-t-15">
                    hii <b> @everone</b> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                    industry&apos;s standard dummy text ever since the 1500s.
                  </p>
                  <Row>
                    <Col sm="auto" className="text-center">
                      <img src={imgGrid1} alt="img" className="img-fluid wid-100" />
                      <h6 className="m-t-15 m-b-0">Old Scooter</h6>
                      <p className="text-muted m-b-0">
                        <small>PNG-100KB</small>
                      </p>
                    </Col>
                    <Col sm="auto" className="text-center">
                      <img src={imgGrid2} alt="img" className="img-fluid wid-100" />
                      <h6 className="m-t-15 m-b-0">Wall Art</h6>
                      <p className="text-muted m-b-0">
                        <small>PNG-150KB</small>
                      </p>
                    </Col>
                    <Col sm="auto" className="text-center">
                      <img src={imgGrid3} alt="img" className="img-fluid wid-100" />
                      <h6 className="m-t-15 m-b-0">Microphone</h6>
                      <p className="text-muted m-b-0">
                        <small>PNG-150KB</small>
                      </p>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" " className="diactive-feed">
                  <div className="feed-user-img">
                    <img src={avatar1} className="img-radius" alt="User-Profile" />
                  </div>
                  <h6>
                    <span className="badge bg-success">Task</span> Sarah marked the Pending Review:{' '}
                    <span className="text-c-green"> Trash Can Icon Design</span>
                    <small className="text-muted"> 2 hours ago</small>
                  </h6>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" " className="diactive-feed">
                  <div className="feed-user-img">
                    <img src={avatar1} className="img-radius" alt="User-Profile" />
                  </div>
                  <h6>
                    <span className="badge bg-primary">comment</span> abc posted a task:{' '}
                    <span className="text-c-green">Design a new Homepage</span> <small className="text-muted">6 hours ago</small>
                  </h6>
                  <p className="m-b-15 m-t-15">
                    hii <b> @everone</b> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                    industry&apos;s standard dummy text ever since the 1500s.
                  </p>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Campaign Monitor</Card.Title>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-card" style={{ height: '362px' }}>
                <PerfectScrollbar>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>
                          <span>Campaign date</span>
                        </th>
                        <th>
                          <span>Click</span>
                        </th>
                        <th>
                          <span>Cost</span>
                        </th>
                        <th>
                          <span>CTR</span>
                        </th>
                        <th>
                          <span>ARPU</span>
                        </th>
                        <th>
                          <span>ECPI</span>
                        </th>
                        <th>
                          <span>ROI</span>
                        </th>
                        <th>
                          <span>Revenue</span>
                        </th>
                        <th>
                          <span>Conversions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>08-11-2016</td>
                        <td>786</td>
                        <td>485</td>
                        <td>769</td>
                        <td>45,3%</td>
                        <td>6,7%</td>
                        <td>8,56</td>
                        <td>10:55</td>
                        <td>33.8%</td>
                      </tr>
                      <tr>
                        <td>15-10-2016</td>
                        <td>786</td>
                        <td>523</td>
                        <td>736</td>
                        <td>78,3%</td>
                        <td>6,6%</td>
                        <td>7,56</td>
                        <td>4:30</td>
                        <td>76.8%</td>
                      </tr>
                      <tr>
                        <td>08-08-2017</td>
                        <td>624</td>
                        <td>436</td>
                        <td>756</td>
                        <td>78,3%</td>
                        <td>6,4%</td>
                        <td>9,45</td>
                        <td>9:05</td>
                        <td>8.63%</td>
                      </tr>
                      <tr>
                        <td>11-12-2017</td>
                        <td>423</td>
                        <td>123</td>
                        <td>756</td>
                        <td>78,6%</td>
                        <td>45,6%</td>
                        <td>6,85</td>
                        <td>7:45</td>
                        <td>33.8%</td>
                      </tr>
                      <tr>
                        <td>05-06-2015</td>
                        <td>465</td>
                        <td>463</td>
                        <td>456</td>
                        <td>68,6%</td>
                        <td>76,6%</td>
                        <td>7,56</td>
                        <td>8:45</td>
                        <td>39.8%</td>
                      </tr>
                      <tr>
                        <td>08-11-2016</td>
                        <td>786</td>
                        <td>485</td>
                        <td>769</td>
                        <td>45,3%</td>
                        <td>6,7%</td>
                        <td>8,56</td>
                        <td>10:55</td>
                        <td>33.8%</td>
                      </tr>
                      <tr>
                        <td>15-10-2016</td>
                        <td>786</td>
                        <td>523</td>
                        <td>736</td>
                        <td>78,3%</td>
                        <td>6,6%</td>
                        <td>7,56</td>
                        <td>4:30</td>
                        <td>76.8%</td>
                      </tr>
                    </tbody>
                  </Table>
                </PerfectScrollbar>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default DashAnalytics;
