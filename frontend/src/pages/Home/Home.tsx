import React from 'react';
import { Grid, Typography, Container } from '@mui/material';

export function Home() {
  return (
    <Container style={{ marginTop: '40px' }}>
      <Typography variant="h4" align="center" style={{ fontWeight: 'bold' }}>
        SVEUČILIŠTE U ZAGREBU
      </Typography>
      <Typography variant="h5" align="center" style={{ fontWeight: 'bold' }}>
        FAKULTET ELEKTROTEHNIKE I RAČUNARSTVA
      </Typography>
      <Typography variant="h5" align="center" style={{ marginTop: '20px' }}>
        DIPLOMSKI ZADATAK br. 3134
      </Typography>
      <Grid container style={{ marginTop: '20px' }}>
        <Grid item xs={2}>
          <Typography variant="body1">
            <strong>Pristupnik:</strong>
          </Typography>
          <Typography variant="body1">
            <strong>Studij:</strong>
          </Typography>
          <Typography variant="body1">
            <strong>Profil:</strong>
          </Typography>
          <Typography variant="body1">
            <strong>Mentor:</strong>
          </Typography>
          <Typography variant="body1">
            <strong>Zadatak:</strong>
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography variant="body1">Zdravko Pandžić (0036512112)</Typography>
          <Typography variant="body1">Računarstvo</Typography>
          <Typography variant="body1">
            Programsko inženjerstvo i informacijski sustavi
          </Typography>
          <Typography variant="body1">
            izv. prof. dr. sc. Boris Milašinović
          </Typography>
          <Typography variant="body1">
            Generička platforma u oblaku za objavu informacija i oglasa
          </Typography>
        </Grid>
      </Grid>
      <Typography variant="h6" style={{ marginTop: '10px' }}>
        Opis zadatka:
      </Typography>
      <Typography variant="body1" paragraph style={{ marginLeft: '20px' }}>
        Tipična funkcionalnost portala namijenjenih za objavu korisnih
        informacija i informacija o događajima svodi se na mogućnost objave
        događaja i notifikaciju zainteresiranih korisnika, pri čemu nije
        neuobičajeno da takav portal ima određene elemente oglasnika. Takav
        koncept je primjenjiv na različite udruge, manja sportska udruženja,
        klubove obožavatelja, poljoprivredne zadruge i slično, a razlika će
        vjerojatno biti u vizualnom izgledu te kategorijama događaja i oglašenih
        proizvoda ili usluga. Ideja ovog rada je napraviti programsko rješenje u
        oblaku koje će predstavljati generičku platformu za uspostavu takvih
        informativnih portala s elementima oglasnika. Zainteresirani klijent bi
        se uz odgovarajući pretplatni model mogao registrirati na platformi,
        kreirati i administrirati vlastiti portal. Krajnji korisnik bi osim
        pregleda sadržaja portala mogao definirati postavke na temelju kojih bi
        dobivao obavijesti prilikom objave novih sadržaja. Rješenje je potrebno
        oblikovati korištenjem mikroservisa i sabirnice poruka, što bi omogućilo
        da se prilikom objave sadržaja aktiviraju različiti servisi, primjerice
        servis za automatsku provjeru sadržaja, servis za notifikacije i slično.
      </Typography>
    </Container>
  );
}
