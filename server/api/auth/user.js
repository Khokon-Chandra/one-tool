export default defineEventHandler(async (event) => {
    const { email, password } = await readBody(event) // Retrieve email and password from the request body

    // Simulate authentication (use actual logic for real applications)
    if (email === 'demo@1tool.com' && password === '1234') {
        // Return a fake API token if authentication is successful
        return {
            api_token: 'Ypd8Tbrhbz1NolZElV6P1IstFc8Q00CK1fosuPAptxnhs3b3PdD4zOUUyJXbrZva0NAexy9RLdY1v9v63xbQIGTZOB0xkfnAIWujxpeAkSoF7mDWptdiwAjFNSJEYL64Uw2oXfZzGkmFQ9c1eXkadR2vqZkYsgN8JWgKXzvHlKU5oGi0tLqdJfU9GT0qLIsEbgkDJtTSdI9qaCE1YUy3u66eDenFDbGDZf7HLwQmxvRbtvGrB7LZ7ipSThqMQLY',
            user: { id: 1, name: 'Test User', email: 'demo@1tool.com' },
            tenant_identifier: 'testing identifier'
        }
    } else {
        // Return an error message if authentication fails
        throw createError({ statusCode: 401, message: 'Invalid credentials', errors: [] })
    }
})
