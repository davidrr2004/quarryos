def test_login_wrong_credentials(client):
    response = client.post(
        "/api/v1/login/access-token",
        data={"username": "fake@wrong.com", "password": "nopassword"}
    )
    assert response.status_code == 400
    assert response.json() == {"detail": "Incorrect email or password"}
