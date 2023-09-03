import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContextProvider';

export function Header() {
  const title = 'Diplomski rad';
  const nav = useNavigate();
  const authContext = React.useContext(UserContext);

  const sections: ReadonlyArray<{
    title: string;
    url: string;
    hide?: boolean;
  }> = [
    { title: 'Početna', url: '/', hide: false },
    { title: 'Kategorije', url: '/categories', hide: false },
    { title: 'Moji filteri', url: '/filters', hide: !authContext.token },
    { title: 'Moje objave', url: '/posts', hide: !authContext.token },
    { title: 'Portal', url: '/portal', hide: !authContext.token },
  ];
  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          // align="center"
          noWrap
        >
          {title}
        </Typography>
        <Toolbar
          component="nav"
          variant="dense"
          sx={{ overflowX: 'auto', flex: 1 }}
        >
          {sections.map(
            (section) =>
              !section.hide && (
                <Link
                  color="inherit"
                  noWrap
                  key={section.title}
                  variant="body2"
                  onClick={() => nav(section.url)}
                  sx={{ p: 1, flexShrink: 0 }}
                >
                  {section.title}
                </Link>
              )
          )}
        </Toolbar>
        {!authContext.token && (
          <>
            <Button
              variant="outlined"
              size="small"
              onClick={() => nav('/login')}
              style={{ marginRight: '10px' }}
            >
              Prijavi se
            </Button>
            <Button
              variant="outlined"
              onClick={() => nav('/register')}
              size="small"
              style={{ marginRight: '10px' }}
            >
              Registriraj se
            </Button>
          </>
        )}

        {authContext.token && (
          <>
            <Typography
              component="h2"
              variant="h6"
              color="inherit"
              align="center"
              noWrap
              style={{ marginRight: '10px' }}
            >
              {authContext.userData?.email}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                authContext.logout();
                nav('/login');
              }}
              size="small"
            >
              Odjava
            </Button>
          </>
        )}
      </Toolbar>
    </React.Fragment>
  );
}
