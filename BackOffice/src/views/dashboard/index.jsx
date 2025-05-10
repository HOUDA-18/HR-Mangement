import React ,{ useEffect, useState } from 'react';
import '/src/index.scss';
import './index.scss';
import axios from 'axios';


// react-bootstrap
import { Row, Col, Card, Table, ListGroup,Form, Button, Pagination } from 'react-bootstrap';
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
import UserDistributionChart from 'components/userDistributionByRole';
import UserDepartmentChart from 'components/usersByDepartement/byDepartements';
import StatusChart from 'components/StatusChart/statusChart';
import UserDistributionByDepartment from 'components/usersByDepartement/byDepartements';
import UserDistributionByStatus from 'components/userDistributionByStatus/byStatus';
import { useNavigate } from 'react-router-dom';

// ==============================|| DASHBOARD ANALYTICS ||============================== //

const DashAnalytics = () => {
  const [showUsers, setShowUsers] = useState(false);
  const [usersCount, setUsersCount]= useState(0);
  const [departementsCount, setDepartementsCount]= useState(0);

  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem("user"))

  const  handleViewEmployees= ()=>{
    if(currentUser.role==="SUPER_ADMIN"){
      navigate(`/app/dashboard/employees`)

    }
    if(currentUser.role=="ADMIN_HR" || currentUser.role=="MEMBRE_HR" || currentUser.role=="HEAD_DEPARTEMENT"){
      navigate(`/app/dashboard/employees`)
    }
  }

  const  handleViewDepartement= ()=>{
    if(currentUser.role==="SUPER_ADMIN"){
      navigate(`/app/dashboard/departements`)

    }
    if(currentUser.departement!==null){
      navigate(`/app/dashboard/departements/details`,{state:{ values: currentUser.departement._id}})
    }
  }

  const  handleViewOffers= ()=>{
    if(currentUser.role==="SUPER_ADMIN"){
      navigate(`/app/dashboard/offers`)

    }
    if(currentUser.departement!==null){
      navigate(`/app/dashboard/offers`)
    }
  }

  const  handleViewAttendance= ()=>{

    if(currentUser.role==="SUPER_ADMIN"){
      navigate(`/app/dashboard/attendance`)

    }
    if(currentUser.departement!==null){
      navigate(`/app/dashboard/attendance`)
    }
  }

  const fetchUsersCount = async () => {
    try {
      const response = await axios.get('http://localhost:8070/api/users/totalUsers'); 
      setUsersCount(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchDepartementsCount = async () => {
    try {
      const response = await axios.get('http://localhost:8070/api/departements/totalDepartements'); 
      setDepartementsCount(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(()=>{
    fetchDepartementsCount()
    fetchUsersCount()
  },[])




  
  return (
    <React.Fragment>
      <Row>
        {/* order cards */}
        <Col md={6} xl={3}>
        <div onClick={()=>handleViewEmployees()} style={{ cursor: 'pointer' }}>
          <OrderCard
            params={{
              title: 'Total Employees',
              class: 'bg-c-blue',
              icon: 'feather icon-users',
              primaryText: usersCount,
              secondaryText: '',
              extraText: ''
            }}
          />
          </div>
        </Col>
         {/* Tableau des utilisateurs */}

        <Col md={6} xl={3}>
        <div onClick={()=>handleViewOffers()} style={{ cursor: 'pointer' }}>
          <OrderCard
              params={{
                title: 'Active Offers',
                class: 'bg-c-green',
                icon: 'feather icon-tag',
                primaryText: '10',
                secondaryText: '',
                extraText: ''
              }}
            />
        </div>
          
        </Col>
        <Col md={6} xl={3}>
          <div onClick={()=>handleViewDepartement()} style={{ cursor: 'pointer' }}>
              <OrderCard
                params={{
                  title: 'Departements',
                  class: 'bg-c-yellow',
                  icon: 'feather icon-server',
                  primaryText: departementsCount,
                  secondaryText: '',
                  extraText: ''
                }}
              />
          </div>
          
        </Col>
        <Col md={6} xl={3}>
          <div onClick={()=>handleViewAttendance()} style={{ cursor: 'pointer' }}>
            <OrderCard
              params={{
                title: 'Attendance',
                class: 'bg-c-red',
                icon: 'feather icon-check-circle',
                primaryText: '80%',
                secondaryText: '',
                extraText: ''
              }}
            />
          </div>
          
        </Col>


<div className="grid-container">
      <UserDistributionChart />
      <UserDistributionByDepartment />
      <UserDistributionByStatus />
    </div>




      </Row>
    </React.Fragment>
  );
};

export default DashAnalytics;
