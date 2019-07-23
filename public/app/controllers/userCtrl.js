/*
    Controller written by - Pankaj tanwar
*/
angular.module('userCtrl',['userServices'])

.controller('regCtrl', function ($scope, $http, $timeout, $location,user) {

    var app = this;

    this.regUser = function (regData) {

        app.successMsg = '';
        app.errorMsg = '';
        app.loading = true;

        console.log(app.regData);

        user.create(app.regData).then(function (data) {

            //console.log(data);
            if(data.data.success) {
                app.loading = false;
                app.successMsg = data.data.message + ' Redirecting to home page...';
                $timeout(function () {
                    $location.path('/');
                }, 2000);

            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    };
})

// Users Controller
.controller('usersCtrl', function (user) {
    var app = this;

    user.getUsers().then(function (data) {

        if(data.data.success) {
            console.log(app.users);
            app.users = data.data.users;
        } else {
            app.errorMsg = data.data.message;
        }
    });
})

// Company Registration Controller
.controller('companyRegistrationCtrl', function (user) {

    var app = this;

    user.getAllCompanies().then(function (data) {
        //console.log(data);
        if(data.data.success) {
            app.companies = data.data.companies;
        }
    });
})

// Add new company controller
.controller('addNewCompanyCtrl', function (user,$scope) {

    var app = this;

    app.successMsg = '';

    $scope.programs = [
        'UG',
        'MTech',
        'MPlan',
        'MSc',
        'PhD'
    ];

    $scope.programsBranches = {
        ug : [
            'Civil Engineering',
            'Electrical Engineering',
            'Chemical Engineering',
            'Mechanical Engineering',
            'Computer Science & Engineering',
            'Metallurgical & Material Science',
            'Electronics & Communication Engineering',
            'Architecture & Planing Engineering'
        ],
        mtech : [
            'Electronics & Communication',
            'Computer Science & Engineering',
            'Electrical Engineering',
            'Chemical Engineering',
            'Mechanical Engineering',
            'Civil Engineering',
            'Metallurgical &Materials Engineering',
            'Materials Research Centre',
            'National Centre for Disaster Mitigation and Management',
            'Centre for Energy and Environment',
        ],
        mplan : [
            'Master of Planning: Urban Planning'
        ],
        msc : [
            'Mathematics',
            'Chemistry',
            'Physics'
        ],
        mba : [
            'Marketing',
            'Human Resource',
            'Finance',
            'Operations'
        ],
        phd : [
            'Architecture',
            'Management',
            'Engineering',
            'Sciences'
        ]
    };

    $scope.programsDiv = {
        ug : false,
        mtech : false,
        mplan : false,
        msc : false,
        mba : false,
        phd : false,
    };

    $scope.showBranchesDiv = function(program) {
        $scope.programsDiv[program.toLowerCase()] = !$scope.programsDiv[program.toLowerCase()];
    }

    app.postCompanyDetails = function (newCompanyData) {
        console.log(app.newCompanyData);
        user.postCompanyDetails(app.newCompanyData).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.successMsg = data.data.message;
            }
        });
    }
})

// company controller
.controller('companyCtrl', function (user, $routeParams) {

    var app = this;

    app.applyStatus = false;
    app.deleteSuccessMsg = '';

    user.getCompanyDetails($routeParams.company_id).then(function (data) {
        console.log(data);
        if(data.data.success) {
            app.companyDetail = data.data.companyDetail;
            //console.log(app.companyDetail)
        }
    });

    // get company schedule
    user.getCompanySchedule($routeParams.company_id).then(function (data) {
        console.log(data);
        if(data.data.success) {
            app.companyScheduleData = data.data.schedule;
        }
    });

    // get company notifications
    user.getCompanyNotifications($routeParams.company_id).then(function (data) {
        console.log(data);
        if(data.data.success) {
            app.companyNotificationsData = data.data.notifications;
        }
    });

    function getCandidateApplyStatusFunction() {
        user.getCandidateApplyStatus($routeParams.company_id).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.applyStatus = true;
                document.getElementById('oneClickApplyButton').className = 'btn btn-danger btn-rounded';
                document.getElementById('oneClickApplyButton').innerHTML = 'Applied successfully!'
            } else {
                app.applyStatus = false;
                document.getElementById('oneClickApplyButton').className = 'btn btn-success btn-rounded';
                document.getElementById('oneClickApplyButton').value = 'One Click Apply'
            }
        });
    }

    getCandidateApplyStatusFunction();

    app.oneClickApply = function () {
        user.oneClickApply($routeParams.company_id).then(function (data) {
            //console.log(data);
            if(data.data.success) {
                getCandidateApplyStatusFunction();
            }
        })
    };

    app.deleteCompany = function () {
        user.deleteCompany($routeParams.company_id).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.deleteSuccessMsg = data.data.message;
            }
        })
    };

    app.addScheduleSuccessMsg = '';
    app.addNotificationSuccessMsg = '';

    app.addCompanySchedule = function (scheduleData) {
        console.log(app.scheduleData)
        user.addCompanySchedule(app.scheduleData,$routeParams.company_id).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.addScheduleSuccessMsg = data.data.message;
            }
        })
    }

    app.addCompanyNotification = function (notificationData) {
        console.log(app.notificationData)
        user.addCompanyNotification(app.notificationData,$routeParams.company_id).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.addNotificationSuccessMsg = data.data.message;
            }
        })
    }

})

// Company Schedule Controller
.controller('companyscheduleCtrl', function (user) {

    let app = this;

    app.successMsg = false;
    app.errorMsg = false;

    user.getSchedule().then(function (data) {
        //console.log(data);
        if(data.data.success) {
            app.schedule = data.data.schedule;
            //console.log(data.data.schedule);
        } else {
            app.errorMsg = data.data.message;
        }
    });

    app.scheduleEvent = function (scheduleData) {

        //console.log(scheduleData);
        user.scheduleCompany(scheduleData).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.successMsg = data.data.message;
            } else {
                app.errorMsg = data.data.message;
            }
        })
    }

})

.controller('announcementsCtrl', function (user) {

    var app = this;

    app.number = false;

    function updateAnnouncements () {
        user.getAnnouncements().then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.announcements = data.data.announcements;
                if(data.data.announcements.length > 0) {
                    app.number = true;
                }
            }
        });
    }

    updateAnnouncements();

    app.successMsg = false;
    app.errorMsg = false;

    app.postAnnouncement = function (announcementData) {
        console.log(announcementData);
        user.postAnnouncement(announcementData).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.successMsg = data.data.message;
                updateAnnouncements();
            } else {
                app.errorMsg = data.data.message;
            }
        })
    }
})


// User Profile Controller
.controller('profileCtrl', function (user) {
    console.log('profile page testing');
})

// User timeline controller
.controller('timelineCtrl', function (user) {
    var app = this;

    user.getTimeline().then(function (data) {
        console.log(data);
        if(data.data.success) {
            app.timelineData = data.data.candidateTimeline;
        }
    })
});