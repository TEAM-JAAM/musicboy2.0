import React from 'react'
import {useDocument} from 'react-firebase-hooks/firestore'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import {Instrument} from '../../firestore/models'
import {MdBorderClear, MdSettings} from 'react-icons/md'

const instrumentNameMap = {
  bassGuitar: 'Bass Guitar',
  electric: 'Electric',
  electricCello: 'Electric Cello',
  kalimba: 'Kalimba',
  marimba: 'Marimba',
  pianoetta: 'Pianoetta',
  steelPan: 'Steel Pan',
  synth: 'Synthesizer',
  tiny: 'Tiny'
}

const mapInstrumentName = instrumentName => {
  return instrumentNameMap[instrumentName] || 'Mystery'
}

export const SingleInstrumentDetails = ({docRef}) => {
  const [instrumentQueryResult, loading, error] = useDocument(docRef)
  const instrumentData = Instrument.fetchInstrumentData(instrumentQueryResult)

  async function handleClear() {
    const instrument = Instrument.fromDocRef(instrumentQueryResult.ref)
    await instrument.clearAllTimeslices()
  }

  if (error) throw new Error('FATAL: firestore error encountered')
  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="align-self-center sr-only">Loading...</span>
      </Spinner>
    )
  }
  if (instrumentQueryResult) {
    return (
      <div>
        <div className="single-instrument-options">
          <h2>{instrumentData.name}</h2>
          <div className="select-instrument-name">
            <label htmlFor="name">select instrument</label>
            <select onChange={handleChange} name="name">
              <option value="" disabled hidden>
                {instrumentData.name}
              </option>
              <option value="synth">synth</option>
              <option value="steelPan">steel pan</option>
              <option value="electricCello">electric cello</option>
            </select>
          </div>
          <div className="select-instrument-key">
            <label htmlFor="key">change key</label>
            <select onChange={handleChange} name="key">
              <option value="" selected disabled hidden>
                {instrumentData.key}
              </option>
              <option value="G_MAJOR">major</option>
              <option value="G_MINOR">minor</option>
              <option value="PENTATONIC">pentatonic</option>
            </select>
          </div>
          <div />
          <Button variant="success" onClick={handleClear}>
            Clear Grid
          </Button>
        </div>
        <Card
          bg="dark"
          text="white"
          border="light"
          className="mr-1"
          style={{width: '15rem'}}
        >
          <Card.Header>
            <Container fluid className="ml-0 mr-0">
              <Row>
                <Col className="pl-0 pr-0">
                  <span className="icon-small">🎹</span>
                </Col>
                <Col className="ml-auto pl-0 pr-0 text-right">
                  <MdBorderClear className="icon-small" onClick={handleClear} />
                  <MdSettings className="icon-small" />
                </Col>
              </Row>
            </Container>
          </Card.Header>
          <Card.Body>
            <Card.Title className="text-center instrument-card-title">
              {mapInstrumentName(instrumentData.name)}
            </Card.Title>
            <Card.Text className="text-muted">{instrumentData.key}</Card.Text>
          </Card.Body>
        </Card>
      </div>
    )
  }
}
