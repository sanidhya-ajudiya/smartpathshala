import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers, faChalkboardTeacher, faMoneyBillWave, faBook,
    faCalendarAlt, faChartLine, faBell, faArrowUp, faArrowDown,
    faUserGraduate, faPercentage, faClock, faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import PageHeader from '../components/UI/PageHeader';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';

const StatisticCard = ({ title, count, icon, color, trend, trendValue, subtitle }) => (
    <div className="col-12 col-sm-6 col-xl-3">
        <Card className="h-100 border-0 shadow-sm transition-all hover-up" bodyClassName="p-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
                <div className={`p-3 rounded-3 bg-${color}-soft text-${color} shadow-sm icon-box`}>
                    <FontAwesomeIcon icon={icon} size="lg" />
                </div>
                {trend && (
                    <div className={`badge ${trend === 'up' ? 'text-success bg-success-soft' : 'text-danger bg-danger-soft'} rounded-pill`}>
                        <FontAwesomeIcon icon={trend === 'up' ? faArrowUp : faArrowDown} className="me-1" />
                        {trendValue}%
                    </div>
                )}
            </div>
            <div>
                <p className="text-muted small fw-bold mb-1 tracking-wider">{title}</p>
                <h2 className="fw-bold mb-0 text-dark">{count}</h2>
                {subtitle && <small className="text-muted mt-2 d-block">{subtitle}</small>}
            </div>
        </Card>
    </div>
);

const Dashboard = () => {
    const { user, loading, hasPermission } = useAuth();
    const [stats, setStats] = useState({});
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setCurrentDate(new Date().toLocaleDateString('en-US', options));

        // Mock Data Loading based on Role
        if (user) {
            loadRoleBasedStats();
        }
    }, [user]);

    const loadRoleBasedStats = () => {
        // In a real app, this would be an API call like /api/dashboard/stats
        if (hasPermission('DASHBOARD_STATS_VIEW') || user.role_id === 1 || user.role_id === 2) {
            // Admin Stats
            setStats({
                param1: { title: 'Total Students', count: 1250, icon: faUsers, color: 'primary', trend: 'up', trendValue: 12 },
                param2: { title: 'Total Teachers', count: 85, icon: faChalkboardTeacher, color: 'info', trend: 'up', trendValue: 4 },
                param3: { title: 'Fees Collected', count: '₹4.5L', icon: faMoneyBillWave, color: 'success', trend: 'down', trendValue: 8 },
                param4: { title: 'Upcoming Exams', count: 5, icon: faBook, color: 'warning' }
            });
        } else if (user.role_id === 3) {
            // Teacher Stats
            setStats({
                param1: { title: 'My Students', count: 120, icon: faUsers, color: 'primary' },
                param2: { title: 'Classes Today', count: 4, icon: faClipboardList, color: 'info', subtitle: 'Next: Math 10-A' },
                param3: { title: 'Pending Marks', count: 25, icon: faBook, color: 'warning' },
                param4: { title: 'Leave Balance', count: 8, icon: faClock, color: 'success' }
            });
        } else if (user.role_id === 4) {
            // Student Stats
            setStats({
                param1: { title: 'My Attendance', count: '85%', icon: faUserGraduate, color: 'primary', trend: 'up', trendValue: 2 },
                param2: { title: 'Next Exam', count: 'Maths', icon: faBook, color: 'danger', subtitle: 'In 2 Days' },
                param3: { title: 'Fees Due', count: '₹0', icon: faMoneyBillWave, color: 'success' },
                param4: { title: 'Avg Grade', count: 'A', icon: faPercentage, color: 'info' }
            });
        } else {
            // Fallback/Staff
            setStats({
                param1: { title: 'Tasks', count: 12, icon: faClipboardList, color: 'primary' },
                param2: { title: 'Messages', count: 5, icon: faBell, color: 'info' },
                param3: { title: 'Pending Actions', count: 3, icon: faClock, color: 'warning' },
                param4: { title: 'Performance', count: 'Good', icon: faChartLine, color: 'success' }
            });
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className="container-fluid animate-fade-in">
            <PageHeader
                title={`WELCOME BACK, ${user ? (user.first_name || user.username).toUpperCase() : 'USER'}`}
                subtitle="Overview of school activities and academic performance metrics."
                action={
                    <div className="d-flex gap-3 align-items-center">
                        <div className="bg-white px-4 py-2 rounded-pill shadow-sm border border-light d-flex align-items-center d-none d-md-flex">
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-primary me-3" />
                            <span className="fw-semibold text-primary">{currentDate}</span>
                        </div>
                        {user && (
                            <Badge variant="primary" className="px-3 py-2 border-0">
                                {user.role_id === 1 ? 'SUPER ADMIN' :
                                    user.role_id === 2 ? 'ADMINISTRATOR' :
                                        user.role_id === 3 ? 'FACULTY' :
                                            user.role_id === 4 ? 'STUDENT' : 'STAFF'}
                            </Badge>
                        )}
                    </div>
                }
            />

            {/* Statistics Row */}
            <div className="row g-4 mb-5">
                {stats.param1 && <StatisticCard {...stats.param1} />}
                {stats.param2 && <StatisticCard {...stats.param2} />}
                {stats.param3 && <StatisticCard {...stats.param3} />}
                {stats.param4 && <StatisticCard {...stats.param4} />}
            </div>

            {/* Main Content Row */}
            <div className="row g-4">
                <div className="col-lg-8">
                    <Card
                        title={user?.role_id === 4 ? "MY ACADEMIC PROGRESS" : "INSTITUTIONAL PERFORMANCE ANALYTICS"}
                        subtitle={user?.role_id === 4 ? "Graphical representation of your learning curve" : "Real-time attendance and academic success metrics"}
                        extra={
                            <select className="form-select form-select-sm border-0 bg-light px-3 fw-bold cursor-pointer">
                                <option>CURRENT TERM</option>
                                <option>PREVIOUS YEAR</option>
                            </select>
                        }
                    >
                        <div className="py-5 d-flex flex-column align-items-center text-center">
                            <div className="bg-light rounded-circle p-5 mb-4 d-flex align-items-center justify-content-center animate-up" style={{ width: '140px', height: '140px' }}>
                                <FontAwesomeIcon icon={faChartLine} size="3x" className="text-primary opacity-50" />
                            </div>
                            <h5 className="fw-bold text-dark">ANALYTICS ENGINE</h5>
                            <p className="text-muted small max-w-sm mx-auto">
                                {user?.role_id === 4
                                    ? "Your latest exam results are being processed."
                                    : "Collecting real-time data from all active modules."}
                            </p>
                        </div>
                    </Card>
                </div>

                <div className="col-lg-4">
                    <Card
                        title="Notice Board"
                        subtitle="Recent announcements"
                        extra={<button className="btn btn-sm text-primary fw-bold p-0 hover-opacity-75">View All</button>}
                        bodyClassName="p-0"
                    >
                        <div className="list-group list-group-flush">
                            {[
                                { day: '24', month: 'FEB', title: 'Annual Sports Day', desc: 'Mandatory assembly at 08:00 AM.' },
                                { day: '28', month: 'FEB', title: 'Science Exhibition', desc: 'Project submission deadline.' },
                                { day: '05', month: 'MAR', title: 'PTM Meeting', desc: 'Term-end progress reports.' },
                            ].map((notice, i) => (
                                <div key={i} className="list-group-item border-0 px-4 py-3 hover-bg-light transition-base cursor-pointer">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-primary text-white rounded-3 p-2 text-center me-3 shadow-sm" style={{ minWidth: '55px' }}>
                                            <div className="h5 fw-bold mb-0">{notice.day}</div>
                                            <div className="small fw-bold opacity-75" style={{ fontSize: '0.65rem' }}>{notice.month}</div>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1 text-dark">{notice.title}</h6>
                                            <p className="small text-muted mb-0">{notice.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 pt-0 mt-3">
                            <div className="bg-warning-soft p-3 rounded-3 border border-warning border-opacity-10 d-flex align-items-center">
                                <FontAwesomeIcon icon={faBell} className="text-warning me-3" />
                                <div className="small fw-bold text-warning-emphasis">
                                    {user?.role_id === 4 ? "You have 2 pending assignments." : "System maintenance scheduled."}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
