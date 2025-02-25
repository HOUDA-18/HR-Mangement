//roles : ['superadmin','chefdepartement','membrerh','adminrh','employee'] 'dev'
const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Dashboard',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/dashboard/analytics',
          roles: ['admin','superadmin','chefdepartement','membrerh','adminrh','employee','dev']
        },
        {
          id: 'departements',
          title: 'Departement',
          type: 'item',
          icon: 'feather icon-server',
          url: '/app/dashboard/departements',
          roles: ['superadmin','dev']
        }
      ]
    },
    {
      id: 'users',
      title: 'Users',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'HR members',
          title: 'HR members',
          type: 'item',
          icon: 'feather icon-user',
          url: '/app/dashboard/hr-member',
          roles: ['superadmin','dev']
        },
        ,
        {
          id: 'Employees',
          title: 'Employees',
          type: 'item',
          icon: 'feather icon-users',
          url: '/app/dashboard/employees',
          roles: ['superadmin','dev']
        }
      ]
    },
    {
      id: 'Leaves',
      title: 'Leaves',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'Leaves',
          title: 'Leaves',
          type: 'item',
          icon: 'feather icon-bookmark',
          url: '/app/dashboard/leaves',
          roles: ['superadmin','chefdepartement','employee','dev']
        },
        {
          id: 'Attendance',
          title: 'Attendance',
          type: 'item',
          icon: 'feather icon-check-circle',
          url: '/app/dashboard/attendance',
          roles: ['superadmin','chefdepartement','employee','dev']
        }
      ]
    },
    {
      id: 'Teams',
      title: 'Teams',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'Workshops',
          title: 'Workshops',
          type: 'item',
          icon: 'feather icon-briefcase',
          url: '/app/dashboard/workshops',
          roles: ['superadmin','chefdepartement','adminrh','employee','dev']
        },
        {
          id: 'Events',
          title: 'Events',
          type: 'item',
          icon: 'feather icon-calendar',
          url: '/app/dashboard/events',
          roles: ['superadmin','chefdepartement','adminrh','employee','dev']
        }
        ,
        {
          id: 'Offers',
          title: 'Offers',
          type: 'item',
          icon: 'feather icon-file-plus',
          url: '/app/dashboard/offers',
          roles: ['superadmin','chefdepartement','membrerh','adminrh','employee','dev']
        }
      ]
    },
    {
      id: 'Discussions',
      title: 'Discussions',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'Chat-rooms',
          title: 'Chat-rooms',
          type: 'item',
          icon: 'feather icon-message-circle',
          url: '/app/dashboard/chat-rooms',
          roles: ['superadmin','adminrh','employee','dev']
        },
        {
          id: 'Complaints',
          title: 'Complaints',
          type: 'item',
          icon: 'feather icon-message-square',
          url: '/app/dashboard/complaints',
          roles: ['superadmin','adminrh','employee','dev']
        }
      ]
    },
/*     {
      id: 'utilities',
      title: 'Utilities',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'component',
          title: 'Component',
          type: 'collapse',
          icon: 'feather icon-box',
          children: [
            {
              id: 'button',
              title: 'Button',
              type: 'item',
              url: '/basic/button'
            },
            {
              id: 'badges',
              title: 'Badges',
              type: 'item',
              url: '/basic/badges'
            },
            {
              id: 'breadcrumb-pagination',
              title: 'Breadcrumb & Pagination',
              type: 'item',
              url: '/basic/breadcrumb-pagination'
            },
            {
              id: 'collapse',
              title: 'Collapse',
              type: 'item',
              url: '/basic/collapse'
            },
            {
              id: 'typography',
              title: 'Typography',
              type: 'item',
              url: '/basic/typography'
            },
            {
              id: 'tooltip-popovers',
              title: 'Tooltip & Popovers',
              type: 'item',
              url: '/basic/tooltip-popovers'
            }
          ]
        }
      ]
    }, */
/*     {
      id: 'auth',
      title: 'Authentication',
      type: 'group',
      icon: 'icon-pages',
      children: [
        {
          id: 'sign in',
          title: 'Login',
          type: 'item',
          icon: 'feather icon-lock',
          url: '/auth/signin-1',
          target: true,
          breadcrumbs: false
        },
        {
          id: 'sign Up',
          title: 'Register',
          type: 'item',
          icon: 'feather icon-log-in',
          url: '/auth/signup-1',
          target: true,
          breadcrumbs: false
        },
        {
          id: 'reset-pass',
          title: 'Reset Password',
          type: 'item',
          icon: 'feather icon-unlock',
          url: '/auth/reset-password-1',
          target: true,
          breadcrumbs: false
        }
      ]
    }, */
  /*   {
      id: 'support',
      title: 'Support',
      type: 'group',
      icon: 'icon-support',
      children: [
        {
          id: 'sample-page',
          title: 'Sample Page',
          type: 'item',
          url: '/sample-page',
          classes: 'nav-item',
          icon: 'feather icon-sidebar'
        },
        {
          id: 'documentation',
          title: 'Documentation',
          type: 'item',
          icon: 'feather icon-help-circle',
          classes: 'nav-item',
          url: 'https://codedthemes.gitbook.io/gradient-able-react/',
          target: true,
          external: true
        }
      ]
    } */
  ]
};

export default menuItems;
