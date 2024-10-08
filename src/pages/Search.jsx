import React, { useState } from 'react'
import { Container, Title, TextInput, Button, Card, Text } from '@mantine/core'
import axios from 'axios'

function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/search?query=${query}`)
      setResults(response.data.results)
    } catch (error) {
      console.error('Error searching:', error)
    }
  }

  return (
    <Container>
      <Title order={2}>Search</Title>
      <TextInput
        placeholder="Enter your search query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        mt="md"
      />
      <Button onClick={handleSearch} mt="sm">Search</Button>
      {results.map((result) => (
        <Card key={result.id} shadow="sm" p="lg" mt="md">
          <Text weight={700}>{result.title}</Text>
          <Text>{result.excerpt}</Text>
        </Card>
      ))}
    </Container>
  )
}

export default Search