# syntax=docker/dockerfile:1
# Build context: raiz do repositório (o projeto embute os scripts de /database/migrations).
#   docker build -f backend/Dockerfile -t catalogo-api .

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY backend/global.json backend/
COPY backend/src/CatalogoCursos.Api/CatalogoCursos.Api.csproj backend/src/CatalogoCursos.Api/
RUN dotnet restore backend/src/CatalogoCursos.Api/CatalogoCursos.Api.csproj
COPY database/migrations database/migrations
COPY backend/src backend/src
RUN dotnet publish backend/src/CatalogoCursos.Api/CatalogoCursos.Api.csproj \
    -c Release -o /app/publish --no-restore /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_HTTP_PORTS=8080 \
    DOTNET_RUNNING_IN_CONTAINER=true
COPY --from=build /app/publish .
# Executa como usuário sem privilégios (já existente nas imagens oficiais do .NET 8+).
USER $APP_UID
EXPOSE 8080
ENTRYPOINT ["dotnet", "CatalogoCursos.Api.dll"]
